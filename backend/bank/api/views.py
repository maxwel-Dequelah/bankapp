from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from ..models import User, Transaction, Account, Card
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, CardSerializer, TransactionSerializer, AccountSerializer, UpdateProfileSerializer

# Helper function to generate JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Register View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        data=request.data.copy()
        data["username"]=data.get('phoneNumber')

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        return Response({
            "user": UserSerializer(user).data,
            "message": "User registered successfully. Please log in."
        }, status=status.HTTP_201_CREATED)

# Update Profile View
class UpdateProfileView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateProfileSerializer

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.serializer_class(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "user": UserSerializer(user).data,
                "message": "Profile updated successfully."
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

# Login View
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Generate JWT token
        tokens = get_tokens_for_user(user)
        
        return Response({
            "tokens": tokens,
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)

# Transaction List/Create View
# Transaction List/Create View
# Transaction List/Create View
class TransactionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()  # Make a copy of the incoming data to work with

        # Extract account and to_account from request data
        from_account = data.get('from_account')
        to_account = data.get('to_account')

        # Validate and get the account instances
        try:
            if from_account:
                data['account'] = Account.objects.get(accountNumber=from_account).pk
            if to_account:
                data['to_account'] = Account.objects.get(accountNumber=to_account).pk
        except Account.DoesNotExist:
            raise ValidationError("One or both of the provided account numbers are invalid.")

        # Set the user as the currently authenticated user
        data['user'] = request.user.pk

        # Validate transaction type and ensure it is specified
        transaction_type = 'transfer'
        if not transaction_type:
            raise ValidationError("Transaction type is required.")
        data['transaction_type'] = transaction_type

        # Use the serializer to validate and save the transaction
        serializer = TransactionSerializer(data=data)
        if serializer.is_valid():
            # Save the transaction if data is valid
            transaction = serializer.save()
            return Response({
                "message": "Transaction created successfully",
                "transaction": serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            # If the serializer is invalid, return validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Balance Retrieve/Update View
class BalanceRetrieveUpdateView(generics.ListAPIView):
    
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        print(f"Your ballance is :{Account.objects.filter(user=self.request.user)}")
        return Account.objects.filter(user=self.request.user)

# User Transaction List View
class UserTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by("-date")

# Card List View
class CardView(generics.ListAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(user=self.request.user)
