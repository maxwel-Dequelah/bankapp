import base64
from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, RegexValidator

import random

def generate_numeric_id():
    """Generate a unique, 11-digit numeric ID for the user."""
    return ''.join([str(random.randint(0, 9)) for _ in range(11)])

def generate_card_number(last_digits="0000"):
    """Generate a 16-digit card number with incrementing last 4 digits."""
    prefix = "123456789012"  # Static prefix for the first 12 digits
    last_four = str(int(last_digits) + 1).zfill(4)  # Increment last 4 digits
    return f"{prefix}{last_four}"

# User model
class User(AbstractUser):
    id = models.CharField(
        primary_key=True,
        max_length=11,
        unique=True,
        validators=[RegexValidator(r'^\d{11,}$')],
        default=generate_numeric_id,
        editable=False
    )
    dob = models.DateField(null=True, blank=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phoneNumber = models.CharField(max_length=10, unique=True)
    email = models.EmailField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} - {self.username}"

# Card model
class Card(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cards")
    card_number = models.CharField(max_length=16, unique=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.card_number:
            last_card = Card.objects.filter(user=self.user).order_by('-card_number').first()
            last_digits = last_card.card_number[-4:] if last_card else "0000"
            self.card_number = generate_card_number(last_digits)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Card {self.card_number} for {self.user}"

# Balance model
class Balance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0.00)]
    )
    lastEdited = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} - {self.user.phoneNumber} - Balance: {self.balance}"

    def adjust_balance(self, amount):
        """Adjust balance, ensuring it doesn't go below 10."""
        new_balance = self.balance + amount
        if new_balance < 10:
            raise ValidationError("Account balance cannot go below 10.")
        self.balance = new_balance
        self.save()

# Transaction model
class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('transfer', 'Transfer'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_transfers", null=True, blank=True)
    date = models.DateTimeField(default=timezone.now)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)

    def __str__(self):
        return f"{self.user.first_name}-{self.user.phoneNumber} - {self.amount} on {self.date} ({self.transaction_type})"

    def save(self, *args, **kwargs):
        """Override save to adjust user's balance before saving the transaction."""
        balance_record = Balance.objects.get(user=self.user)

        if self.transaction_type == 'withdrawal':
            if self.amount < 10:
                raise ValidationError("Minimum withdrawal amount is 10.")
            total_deduction = self.amount * 1.02
            if total_deduction > balance_record.balance:
                raise ValidationError("Insufficient funds for withdrawal.")
            balance_record.adjust_balance(-total_deduction)
        elif self.transaction_type == 'deposit':
            if self.amount <= 0:
                raise ValidationError("Deposit amount must be positive.")
            balance_record.adjust_balance(self.amount)
        elif self.transaction_type == 'transfer':
            if not self.recipient:
                raise ValidationError("Transfer must specify a recipient.")
            if self.amount < 10:
                raise ValidationError("Minimum transfer amount is 10.")
            total_deduction = self.amount * 1.02
            if total_deduction > balance_record.balance:
                raise ValidationError("Insufficient funds for transfer.")
            balance_record.adjust_balance(-total_deduction)
            recipient_balance = Balance.objects.get(user=self.recipient)
            recipient_balance.adjust_balance(self.amount)

        super().save(*args, **kwargs)

# Signal to automatically create balance for new users
@receiver(post_save, sender=User)
def create_user_balance(sender, instance, created, **kwargs):
    if created:
        Balance.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_balance(sender, instance, **kwargs):
    instance.balance.save()
