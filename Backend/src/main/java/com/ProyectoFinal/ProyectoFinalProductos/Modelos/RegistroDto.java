package com.ProyectoFinal.ProyectoFinalProductos.Modelos;

import jakarta.validation.constraints.*;

public class RegistroDto {
    @NotEmpty(message = "El nombre es obligatorio")
    private String nombre;
    
    @NotEmpty(message = "Los apellidos son obligatorios")
    private String apellidos;
    
    @NotEmpty(message = "El DNI es obligatorio")
    @Pattern(regexp = "\\d{8}", message = "El DNI debe tener exactamente 8 números")
    private String dni;
    
    @NotEmpty(message = "El email es obligatorio")
    @Email(message = "El formato del email no es válido")
    private String email;
    
    private String telefono;
    
    @NotEmpty(message = "La dirección es obligatoria")
    private String direccion;
    
    @NotEmpty(message = "La contraseña es obligatoria")
    @Size(min=6, message="La contraseña debe tener mínimo 6 caracteres")
    private String contraseña;
    
    private String confirmarcontraseña;

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

    public String getConfirmarcontraseña() {
        return confirmarcontraseña;
    }

    public void setConfirmarcontraseña(String confirmarcontraseña) {
        this.confirmarcontraseña = confirmarcontraseña;
    }
}