from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
                  path('', views.index, name='index'),
                  path('display_cv', views.display_cv, name='display_cv'),
                  path('export_to_pdf', views.export_to_pdf, name='export_to_pdf'),
                  path('create_cv/', views.create_cv, name='create_cv'),
                  path('delete_cv/', views.delete_cv, name='delete_cv'),
                  path('update_cv/', views.update_cv, name='update_cv'),
                  path('list_cvs/', views.list_cvs, name='list_cvs'),
                  path('create_pdf/', views.create_pdf, name='create_pdf'),
                  path('admin/', admin.site.urls),
              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
