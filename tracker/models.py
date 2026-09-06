from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Transaction(models.Model):
	TRANSACTION_TYPE =[
		('income' , 'Income'),
		('expense' ,'Expense')
	]
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	amount = models.DecimalField( max_digits=10 , decimal_places=2)
	transaction_type =models.CharField(max_length=10 , choices=TRANSACTION_TYPE)
	category = models.CharField(max_length=50)
	description = models.CharField(max_length=100 , blank=True , null=True)
	date = models.DateField(auto_now_add=True)

	def __str__(self):
		return f"{self.user} - {self.amount} - {self.transaction_type}"

