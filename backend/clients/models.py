from django.db import models
import uuid

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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Examination for {self.client.first_name} {self.client.last_name} - {self.state}"
