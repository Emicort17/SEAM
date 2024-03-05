package mx.edu.utez.saem.service.user;

import lombok.AllArgsConstructor;
import mx.edu.utez.saem.config.ApiResponse;
import mx.edu.utez.saem.model.user.UserBean;
import mx.edu.utez.saem.model.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class UserService {
    private final UserRepository repository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(){
        return new ResponseEntity<>(new ApiResponse(repository.findAll(), HttpStatus.OK, "Okey"), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getOne(Long id) {
        Optional<UserBean> userBeanOptional = repository.findById(id);
        if (userBeanOptional.isPresent()) {
            Long id2 = userBeanOptional.get().getId();
            System.out.println(id);
            UserBean user = repository.getOne(id2);
            return new ResponseEntity<>(new ApiResponse(user, HttpStatus.OK, "Recuperado"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiResponse(null, HttpStatus.NOT_FOUND, "No encontrado"), HttpStatus.NOT_FOUND);
        }
    }



    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> save(UserBean user){
        Optional<UserBean> userBeanOptional = repository.findById(user.getId());
        if(userBeanOptional.isPresent())
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "Registro duplicado"), HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(new ApiResponse(repository.saveAndFlush(user), HttpStatus.OK, "Guardado Exitosamente"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> update(UserBean user){
        Optional<UserBean> foundRol = repository.findById(user.getId());
        if(foundRol.isPresent()){
            return new ResponseEntity<>(new ApiResponse(repository.saveAndFlush(user), HttpStatus.OK, "Actualización guardada Exitosamente"), HttpStatus.OK);
        } else{
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "Esta sección no almacena datos nuevos"), HttpStatus.BAD_REQUEST);

        }
    }

    @Transactional
    public ResponseEntity<ApiResponse> delete(Long id) {
        Optional<UserBean> userBeanOptional = repository.findById(id);
        if (userBeanOptional.isPresent() ) {
            repository.deleteById(id);
            return new ResponseEntity<>(new ApiResponse(HttpStatus.OK, false, "User Eliminada"), HttpStatus.OK);
        }

        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "Error de eliminación"), HttpStatus.BAD_REQUEST);
    }
}
