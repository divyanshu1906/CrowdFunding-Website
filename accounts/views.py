from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer, ProjectSerializer, ProfileSerializer,  FilmProjectSerializer, MusicProjectSerializer, ArtProjectSerializer    
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .models import FilmProject, MusicProject, ArtProject, ArtworkImage, AudioSample
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import hmac
import hashlib
import json
from decimal import Decimal

try:
    import razorpay
except Exception:
    razorpay = None


@api_view(['POST'])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        data = {
            "message": "Registration successful",
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        return Response(data, status=status.HTTP_201_CREATED)
    
    return Response({
        "message": "Registration failed",
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_view(request):
    username_or_email = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')

    if not username_or_email or not password:
        return Response(
            {'detail': 'Both username/email and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = None
    user = authenticate(username=username_or_email, password=password)
    if user is None:
        try:
            u = User.objects.get(email=username_or_email)
            user = authenticate(username=u.username, password=password)
        except User.DoesNotExist:
            user = None

    if user is None:
        return Response(
            {'detail': 'Invalid username/email or password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)
    profile = ProfileSerializer(user.profile).data

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': profile.get('role'),  # ✅ add this line
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'message': f'Welcome back, {user.username}!'
    }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    user = request.user
    return Response({
    'user': UserSerializer(user).data,
    'profile': ProfileSerializer(user.profile).data,
    })


#Creating Project Views

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_film_project(request):
    serializer = FilmProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(creator=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_music_project(request):
    serializer = MusicProjectSerializer(data=request.data)
    if serializer.is_valid():
        project = serializer.save(creator=request.user)

        # Handle multiple audio file uploads
        for file in request.FILES.getlist("audio_samples"):
            AudioSample.objects.create(project=project, file=file)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    print("❌ Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_art_project(request):
    serializer = ArtProjectSerializer(data=request.data)
    if serializer.is_valid():
        project = serializer.save(creator=request.user)

        # Handle multiple image files
        for img in request.FILES.getlist('artwork_images'):
            ArtworkImage.objects.create(project=project, image=img)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    print("❌ Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get all projects
@api_view(["GET"])
def get_all_projects(request):
    film_projects = FilmProject.objects.all()
    music_projects = MusicProject.objects.all()
    art_projects = ArtProject.objects.all()

    all_projects = []

    for p in film_projects:
        serialized = FilmProjectSerializer(p).data
        serialized["category"] = "film"
        serialized["unique_id"] = f"film-{p.id}"  # 👈 important
        all_projects.append(serialized)

    for p in music_projects:
        serialized = MusicProjectSerializer(p).data
        serialized["category"] = "music"
        serialized["unique_id"] = f"music-{p.id}"
        all_projects.append(serialized)

    for p in art_projects:
        serialized = ArtProjectSerializer(p).data
        serialized["category"] = "art"
        serialized["unique_id"] = f"art-{p.id}"
        all_projects.append(serialized)

    all_projects.sort(key=lambda x: x["created_at"], reverse=True)
    return Response(all_projects, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_project_by_id(request, category, id):
    try:
        if category == "film":
            project = FilmProject.objects.get(id=id)
            serializer = FilmProjectSerializer(project)
        elif category == "music":
            project = MusicProject.objects.get(id=id)
            serializer = MusicProjectSerializer(project)
        elif category == "art":
            project = ArtProject.objects.get(id=id)
            serializer = ArtProjectSerializer(project)
        else:
            return Response({"error": "Invalid category"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print("Error fetching project:", e)
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
def get_all_films(request):
    projects = FilmProject.objects.all().order_by('-created_at')
    serializer = FilmProjectSerializer(projects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_music(request):
    projects = MusicProject.objects.all().order_by('-created_at')
    serializer = MusicProjectSerializer(projects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_art(request):
    projects = ArtProject.objects.all().order_by('-created_at')
    serializer = ArtProjectSerializer(projects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_order(request):
    """Create a Razorpay order. Expects JSON: { amount: <decimal in INR>, category: 'film'|'music'|'art', project_id: <int> }

    Returns order details and publishable key id for checkout.
    """
    data = request.data
    try:
        amount = Decimal(str(data.get('amount', '0')))
        if amount <= 0:
            return Response({'error': 'Amount must be > 0'}, status=status.HTTP_400_BAD_REQUEST)
        # convert to paise
        amount_paise = int(amount * 100)
    except Exception:
        return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

    category = data.get('category')
    project_id = data.get('project_id')

    if razorpay is None:
        return Response({'error': 'Razorpay library not installed on server'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    order_payload = {
        'amount': amount_paise,
        'currency': 'INR',
        'receipt': f"project_{category}_{project_id}",
        'payment_capture': 1,
    }
    try:
        order = client.order.create(data=order_payload)
        # create local Payment record
        from .models import Payment
        payment = Payment.objects.create(
            user=request.user if request.user and request.user.is_authenticated else None,
            project_category=category or '',
            project_id=project_id or None,
            amount=amount,
            razorpay_order_id=order.get('id')
        )

        return Response({
            'order': order,
            'key': settings.RAZORPAY_KEY_ID,
            'payment_id': payment.id,
        })
    except Exception as e:
        print('Error creating razorpay order:', e)
        return Response({'error': 'Failed to create order'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def verify_payment(request):
    """Verify the payment signature sent from frontend after successful checkout.

    Expects: { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_id }
    """
    payload = request.data
    razorpay_order_id = payload.get('razorpay_order_id')
    razorpay_payment_id = payload.get('razorpay_payment_id')
    razorpay_signature = payload.get('razorpay_signature')
    payment_local_id = payload.get('payment_id')

    if not (razorpay_order_id and razorpay_payment_id and razorpay_signature):
        return Response({'error': 'Missing parameters'}, status=status.HTTP_400_BAD_REQUEST)

    if razorpay is None:
        return Response({'error': 'Razorpay library not installed on server'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature,
        })
    except Exception as e:
        print('Signature verification failed:', e)
        # mark local payment as failed if exists
        from .models import Payment
        if payment_local_id:
            Payment.objects.filter(id=payment_local_id).update(status='failed')
        return Response({'error': 'Signature verification failed'}, status=status.HTTP_400_BAD_REQUEST)

    # signature is valid — update payment
    from .models import Payment
    payment = None
    if payment_local_id:
        try:
            payment = Payment.objects.get(id=payment_local_id)
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            payment.status = 'paid'
            payment.save()
        except Payment.DoesNotExist:
            payment = None

    return Response({'message': 'Payment verified', 'payment': payment_local_id})


@csrf_exempt
def razorpay_webhook(request):
    """Endpoint to receive Razorpay webhooks. Configure the webhook URL and secret in Razorpay dashboard.

    Verifies the signature sent in header 'X-Razorpay-Signature'.
    """
    # raw body required for signature verification
    body = request.body
    signature = request.META.get('HTTP_X_RAZORPAY_SIGNATURE', '')
    secret = getattr(settings, 'RAZORPAY_WEBHOOK_SECRET', None)

    if not secret:
        return Response({'error': 'Webhook secret not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, signature):
        print('Webhook signature mismatch')
        return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        payload = json.loads(body.decode('utf-8'))
    except Exception:
        payload = {}

    # Basic handling: log and optionally update Payment model based on event
    print('Razorpay webhook received:', payload.get('event'))
    # Example: payment.captured
    event = payload.get('event')
    if event == 'payment.captured':
        data = payload.get('payload', {}).get('payment', {}).get('entity', {})
        razorpay_payment_id = data.get('id')
        razorpay_order_id = data.get('order_id')
        amount = Decimal(data.get('amount') or 0) / 100
        # update matching payment
        from .models import Payment
        Payment.objects.filter(razorpay_order_id=razorpay_order_id).update(
            razorpay_payment_id=razorpay_payment_id,
            amount=amount,
            status='paid'
        )

    return Response({'status': 'ok'})

@api_view(['GET'])
def get_film_by_id(request, id):
    try:
        project = FilmProject.objects.get(id=id)
        serializer = FilmProjectSerializer(project)
        return Response(serializer.data)
    except FilmProject.DoesNotExist:
        return Response({'error': 'Film project not found'}, status=404)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_my_projects(request):
    """
    Return all projects created by the authenticated user (film, music, art).
    """
    user = request.user
    all_projects = []

    # 🎬 Film projects
    film_projects = FilmProject.objects.filter(creator=user)
    for p in film_projects:
        serialized = FilmProjectSerializer(p).data
        serialized["category"] = "film"
        serialized["unique_id"] = f"film-{p.id}"
        all_projects.append(serialized)

    # 🎵 Music projects
    music_projects = MusicProject.objects.filter(creator=user)
    for p in music_projects:
        serialized = MusicProjectSerializer(p).data
        serialized["category"] = "music"
        serialized["unique_id"] = f"music-{p.id}"
        all_projects.append(serialized)

    # 🎨 Art projects
    art_projects = ArtProject.objects.filter(creator=user)
    for p in art_projects:
        serialized = ArtProjectSerializer(p).data
        serialized["category"] = "art"
        serialized["unique_id"] = f"art-{p.id}"
        all_projects.append(serialized)

    # Sort newest first
    all_projects.sort(key=lambda x: x["created_at"], reverse=True)

    return Response(all_projects, status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_project(request, category, id):
    model_map = {
        "film": FilmProject,
        "music": MusicProject,
        "art": ArtProject,
    }
    model = model_map.get(category.lower())
    if not model:
        return Response({"error": "Invalid category"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        project = model.objects.get(id=id, creator=request.user)
    except model.DoesNotExist:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    serializer_class = {
        "film": FilmProjectSerializer,
        "music": MusicProjectSerializer,
        "art": ArtProjectSerializer,
    }.get(category.lower())

    if not serializer_class:
        return Response({"error": "Invalid serializer"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = serializer_class(project, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_project(request, category, id):
    print(f"🟢 DELETE endpoint hit: category={category}, id={id}, user={request.user}")
    
    model_map = {
        "film": FilmProject,
        "music": MusicProject,
        "art": ArtProject,
    }
    model = model_map.get(category.lower())
    if not model:
        print("❌ Invalid category")
        return Response({"error": "Invalid category"}, status=status.HTTP_400_BAD_REQUEST)

    project = model.objects.filter(id=id).first()
    if not project:
        print(f"❌ No project found for id={id} in {category}")
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    if project.creator != request.user:
        print(f"⚠️ Unauthorized delete: {request.user} ≠ {project.creator}")
        return Response({"error": "You are not allowed to delete this project"}, status=status.HTTP_403_FORBIDDEN)

    project.delete()
    print("✅ Project deleted successfully!")
    return Response({"message": "Project deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

