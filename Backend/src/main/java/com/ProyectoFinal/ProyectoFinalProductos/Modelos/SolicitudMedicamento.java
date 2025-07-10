package com.ProyectoFinal.ProyectoFinalProductos.Modelos;

import jakarta.persistence.*;

@Entity
@Table(name = "solicitud_medicamentos")
public class SolicitudMedicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "solicitud_id", nullable = false)
    private Solicitud solicitud; // ✅ Sin @JsonIgnore

    @ManyToOne
    @JoinColumn(name = "medicamento_id", nullable = false)
    private Medicamento medicamento; // ✅ Sin @JsonIgnore

    @Column(nullable = false)
    private int cantidad;

    // ✅ Constructor vacío obligatorio para JPA
    public SolicitudMedicamento() {}

    // ✅ Getters y Setters
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

    public Medicamento getMedicamento() {
        return medicamento;
    }

    public void setMedicamento(Medicamento medicamento) {
        this.medicamento = medicamento;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
}
