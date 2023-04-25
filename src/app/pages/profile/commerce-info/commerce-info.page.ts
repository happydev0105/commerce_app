import { NavController } from '@ionic/angular';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { SubscriptionService } from 'src/app/core/services/subscription/subscription.service';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { BehaviorSubject } from 'rxjs';
import { isPast } from 'date-fns';
import { Clipboard } from '@capacitor/clipboard';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-commerce-info',
  templateUrl: './commerce-info.page.html',
  styleUrls: ['./commerce-info.page.scss'],
})
export class CommerceInfoPage implements OnInit {
  subscriptionAlert = new BehaviorSubject<boolean>(false);
  options = [
    {
      name: 'Datos del negocio',
      icon: 'storefront-outline',
      description: 'Gestiona los datos básicos de tu negocio',
      path: 'commerce-data',
      roles: ['gerente']
    },
    {
      name: 'Gestionar empleados',
      icon: 'people-outline',
      description: 'Podrás ver y gestionar a tus empleados, así como especificar su horario',
      path: 'admin-employee',
      roles: ['gerente']
    },
    {
      name: 'Localización negocio',
      icon: 'map-outline',
      description: 'Configura la ubicación de su negocio',
      path: 'location',
      roles: ['gerente']
    },
    {
      name: 'Comentarios del comercio',
      icon: 'chatbubbles-outline',
      description: 'Gestiona las reseñas de tu comercio',
      path: 'reviews',
      roles: ['recepcionista', 'gerente']
    },
    {
      name: 'Suscripción y facturación',
      icon: 'cash-outline',
      description: 'Consulta tu suscripción y método de pago',
      path: 'subscription',
      hasAlert: this.subscriptionAlert,
      roles: ['gerente']
    },
    {
      name: 'Métodos de pago',
      icon: 'wallet-outline',
      description: 'Gestiona los métodos de pago que ofreces en tu negocio',
      path: 'payment-methods',
      roles: ['gerente']
    },
    {
      name: 'Galería de imágenes',
      icon: 'images-outline',
      description: 'Organiza las distintos diseños e imágenes de tu negocio. Mínimo recomendado 4 imágenes.',
      path: 'gallery',
      roles: ['gerente']
    },
    /*  {
       name: 'Cambiar negocio',
       icon: 'repeat-outline',
       description: 'Cambia tu perfil de Yeasy entre tus distintos negocios',
       path: 'faq',
       roles: ['gerente']
     }, */
    /*  {
       name: 'Redes Sociales',
       icon: 'share-social-outline',
       description: 'Gestiona las redes sociales que utilizas en Yeasy',
       path: 'rrss',
       roles: ['empleado', 'recepcionista', 'gerente']
     } */
  ];

  optionsFiltered = [];

  currentUser: Employee;
  currentCommerce: Commerce;

  constructor(
    private navCtrl: NavController,
    private subscriptionService: SubscriptionService,
    private toastService: ToastService,
    private cd: ChangeDetectorRef) {
    this.optionsFiltered = this.options;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.currentCommerce = JSON.parse(localStorage.getItem('currentCommerce'));
  
    
  }

  ionViewWillEnter() {
    this.getCommerceSubscription();
  }

  ngOnInit() {
  }

  getCommerceSubscription() {
    this.subscriptionService.getByCommerce(this.currentCommerce.uuid).subscribe(response => {
      this.subscriptionAlert.next(isPast(new Date(response.expiresAt)) || !response.isActive);
      this.cd.detectChanges();
    });
  }

  goTo(path: string) {
    this.navCtrl.navigateForward([`tabs/profile/commerce-info/${path}`]);
  }
  async copyToClipboard() {
    await Clipboard.write({
      // eslint-disable-next-line id-blacklist
      string: `https://yeasyapp.com/#/${this.currentCommerce.slug}`
    });
    this.toastService.presentToast('¡Url copiada!', true);
  }

}
