package com.ProyectoFinal.ProyectoFinalProductos.Respositorios;

import com.ProyectoFinal.ProyectoFinalProductos.Modelos.SolicitudMedicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SolicitudMedicamentoRepository extends JpaRepository<SolicitudMedicamento, Integer> {
    
    List<SolicitudMedicamento> findBySolicitudId(int solicitudId);
    
    List<SolicitudMedicamento> findByMedicamentoId(int medicamentoId);
    
    @Query("SELECT sm FROM SolicitudMedicamento sm WHERE sm.solicitud.id = :solicitudId")
    List<SolicitudMedicamento> findMedicamentosPorSolicitud(@Param("solicitudId") int solicitudId);
    
    @Query("SELECT SUM(sm.cantidad) FROM SolicitudMedicamento sm WHERE sm.medicamento.id = :medicamentoId")
    Long getTotalCantidadPorMedicamento(@Param("medicamentoId") int medicamentoId);
    
    @Query("SELECT SUM(sm.cantidad * sm.medicamento.peso) FROM SolicitudMedicamento sm WHERE sm.solicitud.id = :solicitudId")
    Double getPesoTotalPorSolicitud(@Param("solicitudId") int solicitudId);
}