package com.ProyectoFinal.ProyectoFinalProductos.Modelos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "medicamentos")
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 100)
    private String dolores;

    @Enumerated(EnumType.STRING)
    @Column(name = "forma_administracion", nullable = false)
    private FormaAdministracion formaAdministracion;

    @Column(name = "nombre_comercial", nullable = false, length = 100)
    private String nombreComercial;

    @Column(name = "descripcion_uso", columnDefinition = "TEXT")
    private String descripcionUso;

    @Column(precision = 5, scale = 2)
    private BigDecimal peso;

    @OneToMany(mappedBy = "medicamento", fetch = FetchType.LAZY)
    @JsonIgnore  // ✅ Evita duplicaciones y ciclos infinitos
    private List<SolicitudMedicamento> solicitudMedicamentos;

    // Enum para forma de administración
    public enum FormaAdministracion {
        Pastilla, Inyección, Jarabe, Pomada, Gotas, Otros
    }

    // Constructores
    public Medicamento() {}

    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getDolores() { return dolores; }
    public void setDolores(String dolores) { this.dolores = dolores; }

    public FormaAdministracion getFormaAdministracion() { return formaAdministracion; }
    public void setFormaAdministracion(FormaAdministracion formaAdministracion) {
        this.formaAdministracion = formaAdministracion;
    }

    public String getNombreComercial() { return nombreComercial; }
    public void setNombreComercial(String nombreComercial) { this.nombreComercial = nombreComercial; }

    public String getDescripcionUso() { return descripcionUso; }
    public void setDescripcionUso(String descripcionUso) { this.descripcionUso = descripcionUso; }

    public BigDecimal getPeso() { return peso; }
    public void setPeso(BigDecimal peso) { this.peso = peso; }

    public List<SolicitudMedicamento> getSolicitudMedicamentos() { return solicitudMedicamentos; }
    public void setSolicitudMedicamentos(List<SolicitudMedicamento> solicitudMedicamentos) {
        this.solicitudMedicamentos = solicitudMedicamentos;
    }
}
