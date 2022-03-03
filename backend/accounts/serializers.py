import json
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from graph.models import UserProfile

class RegisterSerializer(serializers.ModelSerializer):

    username = serializers.CharField(required=True, validators=[UniqueValidator(queryset=User.objects.all(), message="This username has already been taken")])
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all(), message="This email has already been taken")])
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        userProfile = UserProfile.objects.create(
            user = user,
            tabs = [{"id": "home", "settings": False}, {"id": "dashboard"}, {"id": "add"}],
            stocks = [],
        )

        return user

class ChangePasswordSerializer(serializers.Serializer):

    newPassword = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    def create(self, validated_data):
        currUser = validated_data['user']
        currUser.set_password(validated_data['newPassword'])
        currUser.save()

        return currUser
