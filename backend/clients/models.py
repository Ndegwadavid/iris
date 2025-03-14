from django.db import models
import uuid


class Branch(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=5, unique=True)  

    def __str__(self):
        return f"{self.code} - {self.name}"

class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    first_name = models.CharField(max_length=100, blank=False)
    last_name = models.CharField(max_length=100, blank=False)
    dob = models.DateField(blank=False)
    phone_number = models.CharField(max_length=20, blank=False)
    email = models.EmailField(blank=False)
    location = models.CharField(max_length=100, blank=False)
    registered_by = models.CharField(max_length=100, blank=False)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=False)
    previous_prescription = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_examination_date = models.DateField(blank=True, null=True)
    visit_count = models.PositiveIntegerField(default=1)
    reg_no = models.CharField(max_length=20, unique=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    

class Examination(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    EXAMINATION_STATE = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="examinations")
    examination_date = models.DateField(auto_now_add=True)
    examined_by = models.CharField(max_length=100, blank=True)
    clinical_history = models.TextField(blank=True)
    
    # Right Eye
    right_sph = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, default=None)
    right_cyl = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, default=None)
    right_axis = models.IntegerField(blank=True, null=True, default=None)
    right_add = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, default=None)
    right_va = models.CharField(max_length=20, blank=True, default="N/A")
    right_ipd = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, default=None)

    # Left Eye
    left_sph = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, default=None)
    left_cyl = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, default=None)
    left_axis = models.IntegerField(blank=True, null=True, default=None)
    left_add = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, default=None)
    left_va = models.CharField(max_length=20, blank=True, default="N/A")
    left_ipd = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, default=None)


    state = models.CharField(max_length=10, choices=EXAMINATION_STATE, default='Pending')
    booked_for_sales = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Examination for {self.client.first_name} {self.client.last_name} - {self.state}"



class Sales(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    PAYMENT_METHODS = [
        ('Cash', 'Cash'),
        ('Mpesa', 'M-Pesa'),
        ('Card', 'Credit Card'),
        ('Bank', 'Bank Transfer'),
        ('Insurance', 'Insurance'),
    ]

    PAYMENT_STATUS = [
        ('Pending', 'Pending'),
        ('Partially Paid', 'Partially Paid'),
        ('Paid', 'Paid'),
    ]

    # Foreign Key
    examination = models.ForeignKey(Examination, on_delete=models.CASCADE, related_name='sales')

    # Frame Details
    frame_brand = models.CharField(max_length=100)
    frame_model = models.CharField(max_length=100)
    frame_color = models.CharField(max_length=50)
    frame_quantity = models.PositiveIntegerField(default=1)
    frame_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Lens Details
    lens_brand = models.CharField(max_length=100)
    lens_type = models.CharField(max_length=100)
    lens_material = models.CharField(max_length=100)
    lens_coating = models.CharField(max_length=100)
    lens_quantity = models.PositiveIntegerField(default=1)
    lens_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Order Details
    fitting_instructions = models.TextField(blank=True)
    delivery_date = models.DateField(blank=True, null=True)
    booked_by = models.CharField(max_length=100, blank=False)
    served_by = models.CharField(max_length=100, blank=False)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, default='Cash')

    # Payment Fields
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    advance_payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, blank=True, null=True)
    advance_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    balance_due = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Payment Status
    advance_payment_status = models.CharField(max_length=15, choices=PAYMENT_STATUS, default='Pending')
    balance_payment_status = models.CharField(max_length=15, choices=PAYMENT_STATUS, default='Pending')
    order_paid = models.CharField(max_length=15, choices=PAYMENT_STATUS, default='Pending')

    # M-Pesa Transaction Code (Only Required for M-Pesa Payments)
    mpesa_transaction_code = models.CharField(max_length=20, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        """ Auto-calculate total price, balance due, and update payment status before saving. """
        self.total_price = (self.frame_price * self.frame_quantity) + (self.lens_price * self.lens_quantity)
        self.balance_due = self.total_price - self.advance_paid
        
        """Once a sale is made, mark the examination as no longer booked for sales"""
        if self.examination.booked_for_sales:
            self.examination.booked_for_sales = False
            self.examination.save()

        # Update payment status dynamically
        if self.balance_due > 0 and self.advance_paid > 0:
            self.advance_payment_status = "Partially Paid"
            self.balance_payment_status = "Pending"
            self.order_paid = "Partially Paid"
        elif self.balance_due <= 0:
            self.advance_payment_status = "Paid"
            self.balance_payment_status = "Paid"
            self.order_paid = "Paid"
        else:
            self.advance_payment_status = "Pending"
            self.balance_payment_status = "Pending"
            self.order_paid = "Pending"

        super().save(*args, **kwargs)


    def __str__(self):
        return f"Sales for {self.examination.client.first_name} {self.examination.client.last_name} - {self.frame_brand} & {self.lens_brand}"
