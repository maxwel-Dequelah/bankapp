from rest_framework import serializers
from django.contrib.auth import authenticate
from ..models import User, Transaction, Account, Card

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'phoneNumber', 'email', 'address', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phoneNumber=validated_data['phoneNumber'],
            email=validated_data['email'],
            address=validated_data['address'],
            password=validated_data['password']
        )
        return user


# Login Serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user is None:
                raise serializers.ValidationError("Invalid username or password.")
        else:
            raise serializers.ValidationError("Both username and password are required.")
        
        data['user'] = user
        return data


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'phoneNumber', 'email', 'address']


# Card Serializer
class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'user', 'card_number', 'card_Status', 'created_on', 'expiry_Date']
        read_only_fields = ['card_number', 'created_on', 'expiry_Date']


# Transaction Serializer
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'account', 'to_account', 'user', 'date', 'amount', 'transaction_type', 'fee']
        read_only_fields = ['id', 'date', 'fee']

    def validate(self, data):
        transaction_type = data.get('transaction_type')
        
        # Check for 'withdrawal' type
        if transaction_type == 'withdrawal' and not data.get('account'):
            raise serializers.ValidationError("Withdrawal must have a source account.")
        
        # Check for 'deposit' type
        if transaction_type == 'deposit' and not data.get('to_account'):
            raise serializers.ValidationError("Deposit must have a destination account.")
        
        # Check for 'transfer' type
        if transaction_type == 'transfer':
            if not data.get('account') or not data.get('to_account'):
                raise serializers.ValidationError("Transfer must specify both from and to accounts.")
        
        return data


# Balance Serializer
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'accountNumber', 'balance','user', 'lastEdited']
        read_only_fields = ['accountNumber', 'lastEdited']


# Update Profile Serializer
class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phoneNumber', 'email', 'address']
