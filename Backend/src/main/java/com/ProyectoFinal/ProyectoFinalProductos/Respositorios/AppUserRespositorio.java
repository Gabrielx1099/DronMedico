
package com.ProyectoFinal.ProyectoFinalProductos.Respositorios;

import com.ProyectoFinal.ProyectoFinalProductos.Modelos.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AppUserRespositorio extends JpaRepository<AppUser,Integer> {
    public AppUser findByEmail(String email);
    // En tu AppUserRespositorio.java
    
}

