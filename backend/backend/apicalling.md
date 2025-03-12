//creating and registering  clients details:

curl -X POST http://127.0.0.1:8000/api/v001/clients/register/ \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxODU5ODc0LCJpYXQiOjE3NDE3NzM0NzQsImp0aSI6Ijc2M2YwZmY1MDZkZTQ2NTFiMWNlOGJhYjUyNjdmYzZkIiwidXNlcl9pZCI6ImMwZjE4MTNiLTZjMzItNDE3Ni05YWRlLWM1YjdjNTNkMjQ2MiJ9.5pBLDjv3HcVpHzKUir0I-alpwiRHZOwiV2XAc9e6u7c" \
     -d '{
           "first_name": "davidtest",
           "last_name": "Njorogetest",
           "phone_number": "+254797342380",
           "email": "davidtest@gmail.com",
           "location": "nakuru",
           "dob": "2001-05-12",
           "registered_by": "davy",
           "previous_rx": "tested",
           "gender": "M",
           "emergency_contact": "+254797342380",
           "booked": "true"
         }'

┌──(davy㉿kali)-[~]
└─$ curl -X POST http://localhost:8000/api/v001/auth/jwt/create/ \ 
     -H "Content-Type: application/json" \
     -d '{"email": "david@gmail.com", "password": "kali"}' 
{"refresh":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0MTg1OTg3NCwiaWF0IjoxNzQxNzczNDc0LCJqdGkiOiI4Yjc5MTM4ZjgyYWU0NWZkOTdmYzRhZjk5YzI4Y2Y5YiIsInVzZXJfaWQiOiJjMGYxODEzYi02YzMyLTQxNzYtOWFkZS1jNWI3YzUzZDI0NjIifQ.SqPZJSjB_Qj6P21llv4MNoowVeewvMa56_iCwwsRwp4","access":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxODU5ODc0LCJpYXQiOjE3NDE3NzM0NzQsImp0aSI6Ijc2M2YwZmY1MDZkZTQ2NTFiMWNlOGJhYjUyNjdmYzZkIiwidXNlcl9pZCI6ImMwZjE4MTNiLTZjMzItNDE3Ni05YWRlLWM1YjdjNTNkMjQ2MiJ9.5pBLDjv3HcVpHzKUir0I-alpwiRHZOwiV2XAc9e6u7c"}                                                                                                               //exmaination  

curl -X POST http://127.0.0.1:8000/api/v001/clients/examination/{id}/register/ \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxODU5ODc0LCJpYXQiOjE3NDE3NzM0NzQsImp0aSI6Ijc2M2YwZmY1MDZkZTQ2NTFiMWNlOGJhYjUyNjdmYzZkIiwidXNlcl9pZCI6ImMwZjE4MTNiLTZjMzItNDE3Ni05YWRlLWM1YjdjNTNkMjQ2MiJ9.5pBLDjv3HcVpHzKUir0I-alpwiRHZOwiV2XAc9e6u7c" \
     -d '{
           "SP": "davidtest",
           "last_name": "Njorogetest",
           "phone_number": "+254797342380",
           "email": "davidtest@gmail.com",
           "location": "nakuru",
           "dob": "2001-05-12",
           "registered_by": "davy",
           "previous_rx": "tested",
           "gender": "M",
           "emergency_contact": "+254797342380",
           "booked": "true"
         }'

curl -X POST http://127.0.0.1:8000/api/v001/clients/examinations/ \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxODU5ODc0LCJpYXQiOjE3NDE3NzM0NzQsImp0aSI6Ijc2M2YwZmY1MDZkZTQ2NTFiMWNlOGJhYjUyNjdmYzZkIiwidXNlcl9pZCI6ImMwZjE4MTNiLTZjMzItNDE3Ni05YWRlLWM1YjdjNTNkMjQ2MiJ9.5pBLDjv3HcVpHzKUir0I-alpwiRHZOwiV2XAc9e6u7c" \
     -d '{
           "SP": "davidtest",
           "last_name": "Njorogetest",
           "phone_number": "+254797342380",
           "email": "davidtest@gmail.com",
           "location": "nakuru",
           "dob": "2001-05-12",
           "registered_by": "davy",
           "previous_rx": "tested",
           "gender": "M",
           "emergency_contact": "+254797342380",
           "booked": "true"
         }'

         