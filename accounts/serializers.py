from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, BaseProject, FilmProject, MusicProject, ArtProject, ArtworkImage, AudioSample


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ('user', 'display_name', 'bio', 'role', 'verified')


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, default='backer')

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'role')

    def create(self, validated_data):
        role = validated_data.pop('role', 'backer')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        # profile created by signal; set role
        user.profile.role = role
        user.profile.save()
        return user

class FilmProjectSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    poster_image = serializers.ImageField(use_url=True)
    reward_tiers = serializers.JSONField(required=False, help_text="List of {place, reward} objects")

    
    class Meta:
        model = FilmProject
        fields = [
            'id',
            'title',
            'description',
            'goal_amount',
            'raised_amount',
            'creator_name',
            'created_at',
            'trailer_url',
            'poster_image',
            'reward_tiers',
        ]



# Music Serializer
class AudioSampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioSample
        fields = ['id', 'file']


class MusicProjectSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    audio_samples = AudioSampleSerializer(many=True, read_only=True)
    album_cover = serializers.ImageField(use_url=True)
    reward_tiers = serializers.JSONField(required=False, help_text="List of {place, reward} objects")

    class Meta:
        model = MusicProject
        fields = [
            'id',
            'title',
            'description',
            'goal_amount',
            'raised_amount',
            'creator_name',
            'created_at',
            'album_cover',
            'audio_samples',
            'short_video_url',
            'reward_tiers',
        ]



# Art Serializer
class ArtworkImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtworkImage
        fields = ['id', 'image']


class ArtProjectSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    artwork_images = ArtworkImageSerializer(many=True, read_only=True)
    reward_tiers = serializers.JSONField(required=False, help_text="List of {place, reward} objects")

    class Meta:
        model = ArtProject
        fields = [
            'id',
            'title',
            'description',
            'goal_amount',
            'raised_amount',
            'creator_name',
            'created_at',
            'artwork_images',
            'short_video_url',
            'reward_tiers',
        ]

class ProjectSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    description = serializers.CharField()
    goal_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    raised_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    creator_name = serializers.CharField(source='creator.username', required=False)
    created_at = serializers.DateTimeField()
    category = serializers.CharField()

    # Optional media fields for specific project types
    trailer_url = serializers.CharField(required=False, allow_null=True)
    poster_image = serializers.CharField(required=False, allow_null=True)
    album_cover = serializers.CharField(required=False, allow_null=True)
    audio_samples = serializers.ListField(
        child=serializers.CharField(), required=False
    )
    artwork_images = serializers.ListField(
        child=serializers.CharField(), required=False
    )
    short_video_url = serializers.CharField(required=False, allow_null=True)
    reward_tiers = serializers.JSONField(required=False)
