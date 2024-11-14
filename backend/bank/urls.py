from django.urls import path
from .api.views import RegisterView, LoginView, CardView,TransactionListCreateView, BalanceRetrieveUpdateView,GetProfileView , UpdateProfileView, UserTransactionListView

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),

    # Transactions
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),  # List and create transactions

    # Balance
    path('balance/', BalanceRetrieveUpdateView.as_view(), name='balance-retrieve-update'),  # Retrieve and update balance
    path('users/<str:pk>/update/', UpdateProfileView.as_view(), name='update-profile'),
    # path('deposit/', DepositSharesView.as_view(), name='deposit-shares'),
    path('gettransactions/', UserTransactionListView.as_view(), name='user-transactions'),
    path('mycards/', CardView.as_view(), name='cardserializer'),
    path('getmyprofile/', GetProfileView.as_view(), name='getProfile')
]
