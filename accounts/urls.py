from django.urls import path
from . import views


urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('me/', views.me_view, name='me'),

    path('', views.get_all_projects, name='get_all_projects'),
    path('<str:category>/<int:id>/', views.get_project_by_id, name='get_project_by_id'),

    path("my/", views.get_my_projects, name="get_my_projects"),
    path("my/<str:category>/<int:id>/update/", views.update_project, name="update_project"),
    path("my/<str:category>/<int:id>/delete/", views.delete_project, name="delete_project"),

    path('film/create/', views.create_film_project, name='create_film_project'),
    path('music/create/', views.create_music_project, name='create_music_project'),
    path('art/create/', views.create_art_project, name='create_art_project'),
]