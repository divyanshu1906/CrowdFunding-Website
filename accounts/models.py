from django.conf import settings
from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    ROLE_CHOICES = (
        ('creator', 'Creator'),
        ('backer', 'Backer'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    display_name = models.CharField(max_length=120, blank=True)
    bio = models.TextField(blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='backer')
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Profile({self.user.username}, {self.role})"

class BaseProject(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    raised_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="%(class)s_projects")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True  # No table created
        ordering = ["-created_at"]  # Default: newest first

    def __str__(self):
        return self.title


# 🎬 2️⃣ Film Project
class FilmProject(BaseProject):
    trailer_url = models.URLField(blank=True, null=True)  # YouTube or uploaded video
    poster_image = models.ImageField(upload_to="film_posters/", max_length=255)
    reward_tiers = models.JSONField(default=list)  # e.g., [{"amount":500, "reward":"early access"}]


# 🎵 3️⃣ Music Project
class MusicProject(BaseProject):
    album_cover = models.ImageField(upload_to="music_covers/", max_length=255)
    reward_tiers = models.JSONField(default=list)
    short_video_url = models.URLField(blank=True, null=True)  # Optional to match Art


class AudioSample(models.Model):
    project = models.ForeignKey(MusicProject, related_name="audio_samples", on_delete=models.CASCADE)
    file = models.FileField(upload_to="music_samples/", max_length=255)

    def __str__(self):
        return f"Audio sample for {self.project.title}"


# 🎨 4️⃣ Art Project
class ArtProject(BaseProject):
    short_video_url = models.URLField(blank=True, null=True)
    reward_tiers = models.JSONField(default=list)


class ArtworkImage(models.Model):
    project = models.ForeignKey(ArtProject, related_name="artwork_images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="artworks/", max_length=255)

    def __str__(self):
        return f"Artwork for {self.project.title}"