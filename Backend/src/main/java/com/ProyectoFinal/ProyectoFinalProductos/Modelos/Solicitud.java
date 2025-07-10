package com.ProyectoFinal.ProyectoFinalProductos.Modelos;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "solicitudes")
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private AppUser usuario;

    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private Prioridad prioridad;

    @Column(columnDefinition = "TEXT")
    private String destino;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Region region;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_solicitud")
    private EstadoSolicitud estadoSolicitud = EstadoSolicitud.pendiente;

    @ManyToOne
    @JoinColumn(name = "dron_asignado_id")
    private Dron dronAsignado; // ✅ ¡Ya no tiene @JsonIgnore!

    @OneToMany(mappedBy = "solicitud", cascade = CascadeType.ALL)
    @jakarta.persistence.Transient
    private List<SolicitudMedicamento> solicitudMedicamentos;

    @OneToMany(mappedBy = "solicitud")
    @jakarta.persistence.Transient
    private List<Vuelo> vuelos;

    // ✅ Enums con soporte para mayúsculas/minúsculas
    public enum Prioridad {
        alta, media, baja;

        @JsonCreator
        public static Prioridad from(String value) {
            return Prioridad.valueOf(value.toLowerCase());
        }
    }

    public enum Region {
        puno, cusco, amazonas, arequipa;

        @JsonCreator
        public static Region from(String value) {
            return Region.valueOf(value.toLowerCase());
        }
    }

    public enum EstadoSolicitud {
    pendiente, asignada, en_proceso, entregada, cancelada, confirmado;

    @JsonCreator
    public static EstadoSolicitud from(String value) {
        for (EstadoSolicitud estado : EstadoSolicitud.values()) {
            if (estado.name().equalsIgnoreCase(value)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("EstadoSolicitud inválido: " + value);
    }
}


    // Constructor vacío obligatorio
    public Solicitud() {}

    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public AppUser getUsuario() { return usuario; }
    public void setUsuario(AppUser usuario) { this.usuario = usuario; }

    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }

    public Prioridad getPrioridad() { return prioridad; }
    public void setPrioridad(Prioridad prioridad) { this.prioridad = prioridad; }

    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }

    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }

    public EstadoSolicitud getEstadoSolicitud() { return estadoSolicitud; }
    public void setEstadoSolicitud(EstadoSolicitud estadoSolicitud) { this.estadoSolicitud = estadoSolicitud; }

    public Dron getDronAsignado() { return dronAsignado; }
    public void setDronAsignado(Dron dronAsignado) { this.dronAsignado = dronAsignado; }

    public List<SolicitudMedicamento> getSolicitudMedicamentos() { return solicitudMedicamentos; }
    public void setSolicitudMedicamentos(List<SolicitudMedicamento> solicitudMedicamentos) {
        this.solicitudMedicamentos = solicitudMedicamentos;
    }

    public List<Vuelo> getVuelos() { return vuelos; }
    public void setVuelos(List<Vuelo> vuelos) { this.vuelos = vuelos; }
}
