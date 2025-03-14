from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Client, Examination, Sales, Branch
import africastalking
from decouple import config
from datetime import datetime
import uuid


africastalking.initialize(
    username='sandbox',
    api_key=config('AFRICASTALKING_API_KEY', cast=str)

)

sms = africastalking.SMS

def send_message(phone_number, message):
    try:
        response = sms.send(message, [phone_number])
    except Exception as e:
        print(f"SMS sending failed")

    
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
        
@receiver(post_save, sender=Examination)
def mark_examination_as_booked_for_sale(sender, instance, **kwargs):
    if instance.state == "Completed" and not instance.booked_for_sales:
        instance.booked_for_sales = True
        instance.save()

        
@receiver(post_save, sender=Sales)
def send_sales_confirmation(sender, instance, created, **kwargs):
    if created:
        message = f"Hello {instance.examination.client.first_name}, your order has been placed. Total: {instance.total_price}, Balance: {instance.balance_due}."
        send_message(instance.examination.client.phone_number, message)
        

@receiver(post_save, sender=Sales)
def send_sales_update_notification(sender, instance, **kwargs):
    client = instance.examination.client
    phone_number = client.phone_number
    name = client.first_name
    status = instance.order_paid 

    message = f"Hello {name}, your order payment status is now: {status}. Balance Due: {instance.balance_due}. "
    
    if instance.balance_due == 0:
        message = f"Thank you {name}  for your payment. Your order is now complete." 
              

    send_message(phone_number, message)


@receiver(pre_save, sender=Client)
def generate_client_reg_no(sender, instance, **kwargs):
    """
    Generates a unique reg_no in the format:
    [Branch]/[Year]/[Month]/[First 6 chars of UUID]
    Example: M/2025/03/A1B2C3
    """

    if not instance.reg_no:  # Ensure it's not already assigned
        # Extract branch name from "City, Area"
        branch = instance.location

        # Fetch the branch code from the database
        branch = Branch.objects.filter(name__iexact=branch).first()
        branch_code = branch.code if branch else "XX"  
        
        current_year = datetime.now().year
        current_month = datetime.now().month

        #  Use the first 6 characters of UUID
        unique_id = str(uuid.uuid4())[:6].upper()

        # Format the registration number
        new_reg_no = f"{branch_code}/{current_year}/{current_month:02d}/{unique_id}"

        instance.reg_no = new_reg_no  # Assign the unique reg_no
