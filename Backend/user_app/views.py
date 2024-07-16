from django.shortcuts import render,HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from . models import CustomUser,UserProfile
from .serializers import UserCreateSerializer,UserSerializer,UserInfoSerializer,GetAllUsersSerializer
from rest_framework import permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist






@api_view(['GET'])
def getData(request):
    person ={'name':"Dennis", "age":32}
    return Response(person)


class Home(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'Hello, Wor-lddddd!'}
        return Response(content)
    


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        serializer = UserCreateSerializer(data=data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        user = UserSerializer(user)
        return Response(user.data, status=status.HTTP_201_CREATED)


from django.contrib.auth import get_user_model

User = get_user_model()

class LoginView(APIView):
    print("FDTTTTTTTTTTTTTTTTTTTTTTTg")
    permission_classes = [permissions.AllowAny]
    print("FDTTTTTTTTTTTTTTTTTTTTTTT")

    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            print("NOT provided pass od email")
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not User.objects.filter(email=email).exists():
            print("not exist email")
            return Response({"error": "Invalid Email Address"}, status=status.HTTP_400_BAD_REQUEST)
    
        else:
            current_user = User.objects.get(email = email)
            if not current_user.is_active:
                return Response({"error": "User is Blocked By Admin"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=email, password=password)

        if user is None:
            print("USER is not Authenticated",user)
            return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)

        login(request, user)
        print("SSSSSSSSSSSSSSSSSSSSSSSS")
        refresh = RefreshToken.for_user(user)
        user_info_serializer = UserInfoSerializer(user)
        user_info = user_info_serializer.data
        print("THIS IS USER INFO : ",user_info)
        content = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'isAdmin': user.is_superuser,
            'userInfo':user_info,
        }

        return Response(content, status=status.HTTP_200_OK)
    


class UpdateProfile(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        print("userrrrr21",user)
        cus_user = User.objects.get(id = user.id)

        print("GGGGGGGGGGGGGGGGGggg",cus_user)
        profile,created = UserProfile.objects.get_or_create(user=cus_user)
        print("userrrrr",user,profile)
        profile_pic = request.FILES.get('profile_pic')

        if profile_pic:
            profile.profile_pic = profile_pic
            profile.save()
            picture_url = request.build_absolute_uri(profile.profile_pic.url)
            print("picture url",picture_url)

            print('ffofeofmefe',picture_url)
            content = {
                "message": "Profile picture updated successfully",
                'pictureURL':picture_url
            }
            return Response(content, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No image uploaded"}, status=status.HTTP_400_BAD_REQUEST)


class EditUsername(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self,request):
        data = request.data
        user = request.user
        new_name = data.get('new_name')
        if new_name:
            user_obj = User.objects.get(id = user.id)
            user_obj.first_name = new_name
            user_obj.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        



class AdminHome(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        user_info_serializer = GetAllUsersSerializer(users, many=True)
        users_data = user_info_serializer.data

        if users:
            content = {
                'all_users': users_data,
            }
            return Response(content, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

class AdminChangeStatus(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        data = request.data
        stat = data.get('status')
        user_id = data.get('user_id')
        print("stat",stat)
        user = User.objects.get(id = user_id)
        user.is_active = stat
        user.save()
        print("KKKKK")
        users = User.objects.all()
        user_info_serializer = GetAllUsersSerializer(users, many=True)
        users_data = user_info_serializer.data

        if users:
            content = {
                'all_users': users_data,
                "message": "User status changed successfully"
            }
            return Response(content, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

class AdminDeleteUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self,request):
        data = request.data
        user_id = data.get('user_id')
        try:
            user = User.objects.get(id = user_id)
            user.delete()
            users = User.objects.all()
            user_info_serializer = GetAllUsersSerializer(users, many=True)
            users_data = user_info_serializer.data

            if users:
                content = {
                    'all_users': users_data,
                    "message": "User deleted successfully"
                }
                return Response(content, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({'error':'User not Found'},status=status.HTTP_400_BAD_REQUEST)
        

class AdminCreateUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        serializer = UserCreateSerializer(data=data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        user = UserSerializer(user)

        users = User.objects.all()
        user_info_serializer = GetAllUsersSerializer(users, many=True)
        users_data = user_info_serializer.data
        print("userss    :",users)
        if users:
            content = {
                'users': users_data,
            }
            return Response(content, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


    