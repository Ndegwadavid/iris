from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Client, Examination, Sales

def send_message(phone_number, message):
    print(f"Sending message to {phone_number}: {message}")
    
@receiver(post_save, sender=Client)
def send_welcome_message(sender, instance, created, **kwargs):
    if created:
        message = f"Hello {instance.first_name}, welcome to Iris! We are glad to have you."
        send_message(instance.phone_number, message)
        

@receiver(post_save, sender=Examination)
def send_examination_booking_message(sender, instance, created, **kwargs):
    if created:
        message = f"Hello {instance.client.first_name}, your examination is booked for {instance.examination_date}."
        send_message(instance.client.phone_number, message)
        
@receiver(post_save, sender=Sales)
def send_sales_confirmation(sender, instance, created, **kwargs):
    if created:
        message = f"Hello {instance.examination.client.first_name}, your order has been placed. Total: {instance.total_price}, Balance: {instance.balance_due}."
        send_message(instance.examination.client.phone_number, message)
        

@receiver(post_save, sender=Sales)
def send_sales_update_notification(sender, instance, **kwargs):
    """
    Send a message to the client when the sales record is updated.
    This notifies the client about their payment status.
    """
    client = instance.examination.client
    phone_number = client.phone_number
    name = client.first_name
    status = instance.order_paid 

    message = f"Hello {name}, your order payment status is now: {status}. Balance Due: {instance.balance_due}. "
    
    if instance.balance_due == 0:
        message = f"Thank you {name}  for your payment. Your order is now complete." 
              

    send_message(phone_number, message)
