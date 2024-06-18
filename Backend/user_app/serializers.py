from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, CustomUser
User = get_user_model()



class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("email", 'first_name', 'last_name', "password")

    def validate(self, data):
        user = User(**data)
        password = data.get('password')
        email = data.get('email')
        try:
            validate_password(password)
        except exceptions.ValidationError as e:
            serializer_errors = serializers.as_serializer_error(e)
            raise exceptions.ValidationError(
                {'password': serializer_errors['non_field_errors']}
            )

        if User.objects.filter(email=email).exists():
            print("EXEPTION")
            raise exceptions.ValidationError(
                {'email':'This email is already in use.'}
            )
        return data

    def create(self, validated_data):
        user = User(
            username = validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ('password',)


class UserInfoSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_superuser', 'profile_pic']

    def get_profile_pic(self, obj):
        if hasattr(obj, 'user_profile'):
            profile = obj.user_profile
            print("FOF")
            if profile and profile.profile_pic:
                print("profile in seialiser",profile.profile_pic.url)
                return 'http://127.0.0.1:8000'+profile.profile_pic.url
        return None
    

class GetAllUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_superuser','is_active']