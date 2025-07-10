package com.ProyectoFinal.ProyectoFinalProductos.Controlador;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.AppUser;
import com.ProyectoFinal.ProyectoFinalProductos.Respositorios.AppUserRespositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
public class AuthApiController {
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private AppUserRespositorio repo;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        try {
            String email = loginData.get("email");
            String contraseña = loginData.get("contraseña");
            
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, contraseña)
            );
            
            // Obtener información del usuario
            String rol = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
            AppUser usuario = repo.findByEmail(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login correcto");
            response.put("rol", rol);
            
            if (usuario != null) {
                response.put("userId", usuario.getId()); // ← ESTO ES LO QUE FALTABA
                response.put("nombre", usuario.getNombre());
                response.put("email", usuario.getEmail());
            }
            
            // response.put("token", "jwt-token-aqui"); // Opcional
            return ResponseEntity.ok(response);
            
        } catch (AuthenticationException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Credenciales incorrectas");
            return ResponseEntity.status(401).body(response);
        }
    }
}