from rest_framework import serializers
from django.contrib.auth import get_user_model

UserAccount = get_user_model()

class UserAccountSerializer(serializers.ModelSerializer):
    """Serializer for the UserAccount model."""
    
    class Meta:
        model = UserAccount
        fields = ["id", "first_name", "last_name", "email", "role", "is_active"]
        extra_kwargs = {"is_active": {"read_only": True}}  # Prevent changing active status directly
