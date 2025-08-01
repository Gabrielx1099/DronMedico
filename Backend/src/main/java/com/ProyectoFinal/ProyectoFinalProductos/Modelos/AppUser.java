package com.ProyectoFinal.ProyectoFinalProductos.Modelos;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name="Usuarios")
public class AppUser {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    public AppUser() {}

    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false)
    private String apellidos;
    
    @Column(unique=true, nullable=false) // Cambiado de nullable=true a nullable=false
    private String dni;
    
    @Column(unique=true, nullable=false)
    private String email;
    
    private String telefono;
    
    @Column(nullable = false)
    private String direccion;
    
    @Column(nullable = false)
    private String contraseña;
    
    private String rol;
    
    private Date fechacreacion;
    
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getApellidos() {
        return apellidos;
    }
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }
    public String getDni() {
        return dni;
    }
    public void setDni(String dni) {
        this.dni = dni;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    public String getDireccion() {
        return direccion;
    }
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    public String getContraseña() {
        return contraseña;
    }
    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }
    public String getRol() {
        return rol;
    }
    public void setRol(String rol) {
        this.rol = rol;
    }
    public Date getFechacreacion() {
        return fechacreacion;
    }
    public void setFechacreacion(Date fechacreacion) {
        this.fechacreacion = fechacreacion;
    }
}