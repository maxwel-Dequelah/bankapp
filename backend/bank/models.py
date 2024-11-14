import base64
from decimal import Decimal
from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, RegexValidator
from datetime import timedelta
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
    SSN = models.IntegerField(null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phoneNumber = models.CharField(max_length=10, unique=True)
    email = models.EmailField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    address = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} - {self.username}"

# Card model
class Card(models.Model):
    CARD_STATUS_OPTIONS = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('deactivated', 'Deactivated'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cards")
    card_number = models.CharField(max_length=16, unique=True, editable=False)
    card_Status = models.CharField(max_length=25, choices=CARD_STATUS_OPTIONS, default="active", blank=True, null=True)
    created_on = models.DateField(auto_now_add=True, blank=True, null=True)
    expiry_Date = models.DateField(editable=False, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.expiry_Date = timezone.now().date() + timedelta(days=365)
        if not self.card_number:
            last_card = Card.objects.all().order_by('-card_number').first()
            last_digits = last_card.card_number[-4:] if last_card else "0000"
            self.card_number = generate_card_number(last_digits)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Card {self.card_number} for {self.user}"

# Account model
def generate_Account_number(last_accountNumber):
    return "098765432100" + str(int(last_accountNumber) + 1)

class Account(models.Model):
    accountNumber = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="accountName")
    balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    lastEdited = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.accountNumber:
            last_account = Account.objects.all().order_by('-accountNumber').first()
            last_digit = last_account.accountNumber[-4:] if last_account else "0"
            self.accountNumber = generate_Account_number(last_digit)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.accountNumber} - Phone: {self.user.phoneNumber} - Balance: {self.balance}"

    def adjust_balance(self, amount):
        new_balance = self.balance + Decimal(amount)
        if new_balance < 0:
            raise ValidationError("Account balance cannot go below 0.")
        self.balance = new_balance
        self.save()

# Transaction model
class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('transfer', 'Transfer'),
        ('received', 'Received'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User,related_name="TransuctionUser", on_delete=models.CASCADE)
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="sent_transactions")
    to_account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="received_transactions", null=True, blank=True
    )
    from_account= models.ForeignKey(Account,on_delete=models.CASCADE, related_name="accountthatSent", null=True,blank=True)
    date = models.DateTimeField(default=timezone.now)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), editable=False)

    def __str__(self):
        return f"{self.transaction_type.capitalize()} of {self.amount} on {self.date} ({self.id})"

    def save(self, *args, **kwargs):
        
        if self.transaction_type == 'withdrawal':
            self.handle_withdrawal()

        elif self.transaction_type == 'deposit':
            self.handle_deposit()

        elif self.transaction_type == 'transfer':
            self.handle_transfer()
        self.user = self.account.user
        super().save(*args, **kwargs)

    def handle_withdrawal(self):
        if not self.account:
            raise ValidationError("Withdrawal must have a source account.")
        if self.amount < Decimal('5.00'):
            raise ValidationError("Minimum withdrawal amount is 5.")
        self.fee = self.amount * Decimal('0.02')  # 2% fee
        total_deduction = self.amount + self.fee

        if total_deduction > self.account.balance:
            raise ValidationError("Insufficient funds for withdrawal.")

        # Deduct the total (amount + fee) from the source account balance
        self.account.adjust_balance(-total_deduction)

    def handle_deposit(self):
        if not self.account:
            raise ValidationError("Deposit must have a destination account.")
        if self.amount <= Decimal('0.00'):
            raise ValidationError("Deposit amount must be positive.")

        # Add the amount to the destination account balance
        balanceNow =self.account.balance
        self.account.adjust_balance(self.amount)

    def handle_transfer(self):
        if not self.account or not self.to_account:
            raise ValidationError("Transfer must specify both from and to accounts.")
        if self.amount < Decimal('5.00'):
            raise ValidationError("Minimum transfer amount is 5.")

        self.fee = self.amount * Decimal('0.02')  # 2% fee
        total_deduction = self.amount + self.fee

        if total_deduction > self.account.balance:
            raise ValidationError("Insufficient funds for transfer.")

        # Deduct from sender and add to recipient
        self.account.adjust_balance(-total_deduction)
        self.to_account.adjust_balance(self.amount)

        # Create a complementary "received" transaction for the recipient
        Transaction.objects.create(
            account=self.to_account,
            from_account=self.account,
            amount=self.amount,
            transaction_type='received'
        )
# Signal to automatically create account for new users
@receiver(post_save, sender=User)
def create_user_account(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(user=instance, balance=Decimal('0.00'))
