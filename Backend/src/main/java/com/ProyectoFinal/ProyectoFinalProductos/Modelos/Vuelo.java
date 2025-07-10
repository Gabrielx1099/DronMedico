package com.ProyectoFinal.ProyectoFinalProductos.Modelos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vuelos")
public class Vuelo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "solicitud_id", nullable = false)
    @JsonIgnoreProperties({"vuelos", "solicitudMedicamentos", "usuario", "dronAsignado"})
    private Solicitud solicitud;

    @ManyToOne
    @JoinColumn(name = "dron_id", nullable = false)
    @JsonIgnoreProperties({"vuelos", "solicitudes"})
    private Dron dron;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(name = "duracion_minutos")
    private Integer duracionMinutos;

    @Column(name = "distancia_km", precision = 5, scale = 2)
    private BigDecimal distanciaKm;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_entrega")
    private EstadoEntrega estadoEntrega;

    public enum EstadoEntrega {
        exitoso, fallido, desviado, incompleto
    }

    // Constructor vacío requerido por JPA
    public Vuelo() {}

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Solicitud getSolicitud() {
        return solicitud;
    }

    public void setSolicitud(Solicitud solicitud) {
        this.solicitud = solicitud;
    }

    public Dron getDron() {
        return dron;
    }

    public void setDron(Dron dron) {
        this.dron = dron;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Integer getDuracionMinutos() {
        return duracionMinutos;
    }

    public void setDuracionMinutos(Integer duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }

    public BigDecimal getDistanciaKm() {
        return distanciaKm;
    }

    public void setDistanciaKm(BigDecimal distanciaKm) {
        this.distanciaKm = distanciaKm;
    }

    public EstadoEntrega getEstadoEntrega() {
        return estadoEntrega;
    }

    public void setEstadoEntrega(EstadoEntrega estadoEntrega) {
        this.estadoEntrega = estadoEntrega;
    }
}
