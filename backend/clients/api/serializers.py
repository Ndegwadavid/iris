from rest_framework import serializers
from ..models import Client, Examination

class ExaminationSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Examination
        fields = [
            "id",
            "client",
            "client_name",
            "examination_date",
            "examined_by",
            "clinical_history",
            "right_sph", "right_cyl", "right_axis", "right_add", "right_va", "right_ipd",
            "left_sph", "left_cyl", "left_axis", "left_add", "left_va", "left_ipd",
            "state",
            "created_at",
            "updated_at",
        ] 
        read_only_fields = ["id", "examination_date", "created_at", "updated_at"] 
        
    def get_client_name(self, obj):
        return f"{obj.client.first_name} {obj.client.last_name}" if obj.client else None



class ClientRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['first_name', 'last_name', 'dob', 'phone_number', 'email', 'location', 'registered_by', 'gender', 'previous_prescription']
        read_only_fields = ['id', 'created_at', 'updated_at']