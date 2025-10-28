package com.tonchan;

import com.tonchan.BuildConfig;

import android.app.Application;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.soloader.SoLoader;

import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;

import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.security.ProviderInstaller;
import com.google.android.gms.security.ProviderInstaller.ProviderInstallListener;

import com.google.firebase.FirebaseApp;

import java.util.List;
import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Response;
import okhttp3.Request;

/**
 * Classe principale dell'applicazione Tonchan.
 * Inizializza React Native, Firebase e configura l'intercettazione dell'User-Agent.
 */
public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Aggiunta manuale di pacchetti non autolinkabili
      packages.add(new RNBackgroundFetchPackage());
      packages.add(new TurtleCoinPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    // 🔥 Inizializzazione Firebase necessaria per evitare crash
    FirebaseApp.initializeApp(this);

    // ⚙️ Aggiornamento del provider di sicurezza per compatibilità TLS
    upgradeSecurityProvider();

    // 🧭 Impostazione User-Agent personalizzato per tutte le richieste HTTP
    setUserAgent("tonchan-v1.2.3");

    // 🚀 Inizializzazione del loader nativo di React Native
    SoLoader.init(this, /* native exopackage */ false);
  }

  /**
   * Imposta un interceptor personalizzato per modificare l'User-Agent
   */
  public void setUserAgent(String userAgent) {
    OkHttpClientProvider.setOkHttpClientFactory(new UserAgentClientFactory(userAgent));
  }

  /**
   * Aggiorna il provider di sicurezza tramite Google Play Services
   */
  private void upgradeSecurityProvider() {
    ProviderInstaller.installIfNeededAsync(this, new ProviderInstallListener() {
      @Override
      public void onProviderInstalled() {
        Log.i("SecurityProvider", "Provider TLS aggiornato correttamente.");
      }

      @Override
      public void onProviderInstallFailed(int errorCode, Intent recoveryIntent) {
        GooglePlayServicesUtil.showErrorNotification(errorCode, MainApplication.this);
        Log.e("SecurityProvider", "Fallito aggiornamento TLS provider: codice " + errorCode);
      }
    });
  }
}

/**
 * Interceptor per modificare l'User-Agent nelle richieste HTTP
 */
class UserAgentInterceptor implements Interceptor {

  private final String userAgent;

  public UserAgentInterceptor(String userAgent) {
    this.userAgent = userAgent;
  }

  @Override
  public Response intercept(Chain chain) throws IOException {
    Request originalRequest = chain.request();
    Request modifiedRequest = originalRequest.newBuilder()
        .removeHeader("User-Agent")
        .addHeader("User-Agent", this.userAgent)
        .build();

    return chain.proceed(modifiedRequest);
  }
}

/**
 * Factory per creare un client HTTP con interceptor personalizzato
 */
class UserAgentClientFactory implements OkHttpClientFactory {

  private final String userAgent;

  public UserAgentClientFactory(String userAgent) {
    this.userAgent = userAgent;
  }

  @Override
  public OkHttpClient createNewNetworkModuleClient() {
    return OkHttpClientProvider.createClientBuilder()
        .addInterceptor(new UserAgentInterceptor(this.userAgent))
        .build();
  }
}