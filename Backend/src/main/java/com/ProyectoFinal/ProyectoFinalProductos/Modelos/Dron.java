package com.ProyectoFinal.ProyectoFinalProductos.Modelos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "drones")
public class Dron {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id") // ✅ Asegura la correcta deserialización del ID desde JSON
    private int id;

    private String identificador;

    private String modelo;

    @Column(name = "capacidad_kg", precision = 5, scale = 2)
    private BigDecimal capacidadKg;

    @Column(name = "nivel_bateria")
    private Integer nivelBateria;

    @OneToMany(mappedBy = "dronAsignado", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Solicitud> solicitudes;

    @OneToMany(mappedBy = "dron", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Vuelo> vuelos;

    // ✅ Constructor vacío obligatorio para JPA y Jackson
    public Dron() {}

    // ✅ Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getIdentificador() {
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public BigDecimal getCapacidadKg() {
        return capacidadKg;
    }

    public void setCapacidadKg(BigDecimal capacidadKg) {
        this.capacidadKg = capacidadKg;
    }

    public Integer getNivelBateria() {
        return nivelBateria;
    }

    public void setNivelBateria(Integer nivelBateria) {
        this.nivelBateria = nivelBateria;
    }

    public List<Solicitud> getSolicitudes() {
        return solicitudes;
    }

    public void setSolicitudes(List<Solicitud> solicitudes) {
        this.solicitudes = solicitudes;
    }

    public List<Vuelo> getVuelos() {
        return vuelos;
    }

    public void setVuelos(List<Vuelo> vuelos) {
        this.vuelos = vuelos;
    }
}
