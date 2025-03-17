# api/serializers.py
from rest_framework import serializers
from ..models import Client, Examination, Sales, Branch

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name', 'code']

class ExaminationSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()
    client_reg_no = serializers.CharField(source='client.reg_no', read_only=True)
    registered_by = serializers.CharField(source='client.registered_by', read_only=True)
    
    class Meta:
        model = Examination
        fields = [
            "id",
            "client",
            'client_reg_no',
            'registered_by', 
            "client_name",
            "examination_date",
            "examined_by",
            "clinical_history",
            "right_sph", "right_cyl", "right_axis", "right_add", "right_va", "right_ipd",
            "left_sph", "left_cyl", "left_axis", "left_add", "left_va", "left_ipd",
            "state",
            'booked_for_sales',
            "created_at",
            "updated_at",
        ] 
        read_only_fields = ["id", "examination_date", "created_at", "updated_at"] 
        
    def get_client_name(self, obj):
        return f"{obj.client.first_name} {obj.client.last_name}" if obj.client else None

class ClientRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            'id', 'reg_no', 'first_name', 'last_name', 'dob', 'phone_number', 'email', 
            'location', 'branch', 'registered_by', 'gender', 'visit_count', 
            'previous_prescription', 'last_examination_date'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

# api/serializers.py (partial)
class SalesSerializer(serializers.ModelSerializer):
    examination = serializers.PrimaryKeyRelatedField(
        queryset=Examination.objects.all(),
    )

    class Meta:
        model = Sales
        fields = '__all__'
        read_only_fields = ['balance_due', 'order_paid', 'advance_payment_status', 'balance_payment_status']

    def validate(self, data):
        """Ensure valid M-Pesa transaction code if M-Pesa is used."""
        if data.get("advance_payment_method") == "Mpesa" and not data.get("mpesa_transaction_code"):
            raise serializers.ValidationError({"mpesa_transaction_code": "M-Pesa transaction code is required for M-Pesa payments."})
        if self.instance is None:  # Creating a new sale
            examination_instance = data.get("examination")
            if not examination_instance:
                raise serializers.ValidationError({"examination": "This field is required when creating a sale."})
            if Sales.objects.filter(examination=examination_instance).exists():
                raise serializers.ValidationError({"examination": "A sale for this examination already exists."})
        return data

    def create(self, validated_data):
        """Override create to handle payment logic."""
        instance = Sales.objects.create(**validated_data)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        """Override update for balance payment logic."""
        if instance.balance_due == 0:
            raise serializers.ValidationError({"error": "Sale is already fully paid. No further payments allowed."})

        amount_paid = validated_data.get("advance_paid", 0)
        if amount_paid > instance.balance_due:
            raise serializers.ValidationError({
                "error": f"Payment exceeds the remaining balance due. Please pay the exact balance amount {instance.balance_due} or less."
            })

        if amount_paid > 0:
            instance.advance_paid += amount_paid
            instance.balance_due -= amount_paid
            if instance.balance_due <= 0:
                instance.balance_due = 0
                instance.balance_payment_status = "Paid"
                instance.order_paid = "Paid"
            else:
                instance.balance_payment_status = "Partially Paid"
                instance.order_paid = "Partially Paid"

        for attr, value in validated_data.items():
            if attr != "advance_paid":
                setattr(instance, attr, value)

        instance.save()
        return instance

class ClientSerializer(serializers.ModelSerializer):
    examinations = ExaminationSerializer(many=True, read_only=True, source="examinations.all")
    latest_examination_id = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    latest_sales_id = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = [
            "id", "reg_no", "first_name", "last_name", "dob", "phone_number", "email",
            "last_examination_date", "visit_count", "examinations", "latest_examination_id",
            "balance", "payment_status", "latest_sales_id"  # Added latest_sales_id here
        ]

    def get_latest_examination_id(self, obj):
        latest_exam = obj.examinations.order_by("-examination_date").first()
        return str(latest_exam.id) if latest_exam else None

    def get_balance(self, obj):
        sales = Sales.objects.filter(examination__client=obj, balance_due__gt=0)
        return float(sum(sale.balance_due for sale in sales)) if sales.exists() else 0.0

    def get_payment_status(self, obj):
        balance = self.get_balance(obj)
        return "fully_paid" if balance == 0 else "pending_balance"

    def get_latest_sales_id(self, obj):
        latest_sale = Sales.objects.filter(examination__client=obj).order_by("-created_at").first()
        return str(latest_sale.id) if latest_sale else None