from django.shortcuts import render , redirect
from django.contrib.auth import logout
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view ,permission_classes
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer
from rest_framework.permissions import IsAuthenticated 
from django.contrib.auth.models import User


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def get_transactions(request):

    if request.method == 'GET':
        transactions = Transaction.objects.filter(user=request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user = request.user)
            return Response(serializer.data)
        return Response(serializer.errors)

    elif request.method == 'PUT':
        txn = get_object_or_404( Transaction , id=request.data['id'] , user = request.user)
        serializer = TransactionSerializer(txn, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    elif request.method == 'DELETE':
        txn = get_object_or_404( Transaction,id=request.data['id'] , user = request.user)
        txn.delete()
        return Response({"message": "Deleted successfully"})



@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    confirm_password = request.data.get('confirm_password')

    if not username or not password or not confirm_password:
        return Response({"error": "All fields are required."}, status=400)
    
    if len(password) < 8:
        return Response(
            {"error": "Password must be at least 8 characters."},
            status=400
    )

    if password != confirm_password:
        return Response({"error": "Passwords do not match."}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists."}, status=400)

    User.objects.create_user(
        username=username,
        password=password
    )

    return Response({"message": "Registration successful."}, status=201)

def welcome_view(request):
    return render(request , "tracker/index.html" )

def login_view(request):
    return render(request , "tracker/login.html")

def dashboard_view(request):
    return render(request , "tracker/dashboard.html")

def add_transaction_view(request):
    return render(request , "tracker/add_transaction.html")

def transactions_page(request):
    return render(request , "tracker/transactions.html")

def logout_view(request):
    logout(request)
    return redirect("/login_page/")

def register_page(request):
    return render(request, 'tracker/register.html')