package com.ProyectoFinal.ProyectoFinalProductos.Respositorios;

import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Medicamento;
import com.ProyectoFinal.ProyectoFinalProductos.Modelos.Medicamento.FormaAdministracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, Integer> {
    
    Optional<Medicamento> findByNombreComercial(String nombreComercial);
    
    List<Medicamento> findByDoloresContainingIgnoreCase(String dolor);
    
    List<Medicamento> findByFormaAdministracion(FormaAdministracion formaAdministracion);
    
    @Query("SELECT m FROM Medicamento m WHERE LOWER(m.dolores) LIKE LOWER(CONCAT('%', :dolor, '%'))")
    List<Medicamento> buscarPorDolor(@Param("dolor") String dolor);
    
    @Query("SELECT m FROM Medicamento m WHERE m.formaAdministracion = :forma AND LOWER(m.dolores) LIKE LOWER(CONCAT('%', :dolor, '%'))")
    List<Medicamento> buscarPorDolorYForma(@Param("dolor") String dolor, 
                                          @Param("forma") FormaAdministracion forma);
}