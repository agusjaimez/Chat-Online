var url = 'http://localhost:3000/sala';
var selected;
var id;
var usuario;
var salaId;

$(document).on("click",".sala",function(){
  if (usuario!=null) {
    console.log($(this).attr("id"));
    getId($(this).attr("id"));
    obtenerMensajes($(this).attr("id"));
  }else {
    alert("Inicie sesion para poder hablar y ver mensajes");
  }
})

$("#crear").click(function crearSala(e){
  if (usuario!=null) {
    nueva_sala= $("#nuevaSala").val();
    data={};
    data["sala"]=nueva_sala;
    //data[nueva_sala]=[];
    console.log(data);
    if(nueva_sala!=""){
      $.ajax({
        method:"POST",
        url:url,
        contentType: "application/json",
        dataType:"json",
        data:JSON.stringify(data),
        beforeSend: function(xmlHttpRequest) {
          xmlHttpRequest.withCredentials = true;
        },
        success: function(res){
          $("#modal-crear-sala").modal("hide");
          $("#list-tab").append("<a class='list-group-item list-group-item-action sala' name='"+nueva_sala+"' id='"+nueva_sala+"' data-toggle='list' role='tab'>"+nueva_sala+"</a>");
          $("#nueva_sala").val("");
        },
        error:function(error){
          $("#nueva_sala").val("");
          alert("error: "+ error.status);
        }
      });
      e.preventDefault();
    }else{
      alert("Complete los campos");
    }
  }else {
    alert("Inicie sesion para poder hablar y ver mensajes");
  }

});

function getId(sala){
  $.ajax({
    method:"GET",
    url:url+"?sala="+sala,
    success: function(resultado){
      console.log(Object.values(resultado[0])[1]);
      salaId=Object.values(resultado[0])[1]
    },
    error: function(e){
      alert(e.status)
    }
  });
}

$("#unirse").click(function getSala(){
  if (usuario!=null) {
    let sala=$("#nombreDeSala").val()
    console.log(url+"?sala="+sala);
    $.ajax({
      method:"GET",
      url:url+"?sala="+sala,
      success: function(resultado){
        let tof=true;
        let salas_actuales=$(".list-group-item")
        if(resultado!=null){
        for (var i = 0; i < salas_actuales.length; i++) {
          if (salas_actuales[i].name!=sala) {
            tof=true;
          }else{
            tof=false;
          }
        }
        if (tof==true) {
          $("#list-tab").append("<a class='list-group-item list-group-item-action sala' name='"+sala+"' id='"+sala+"' data-toggle='list' role='tab' >"+sala+"</a>");
          $("#nombreDeSala").val("");
          $("#modal-sala").modal("hide");
        }else {
          $("#modal-sala").modal("hide");
          alert("Ya estas en la sala!");
          $("#usuarioDeSala").val("");
        }
      }else {
        alert("La sala no existe");
        $("#usuarioDeSala").val("");
      }
    },
      error:function(error){
        $("#usuarioDeSala").val("");
        alert("error "+error.status);
      }
  });
}else {
  alert("Inicie sesion para poder hablar y ver mensajes");
}
});

  function obtenerMensajes(nom){
    clearInterval(id);
    selected=nom;
    id=setInterval(function(){
        $.ajax({
          method:"GET",
          url:url+"/"+salaId+"/mensajes",
          success: function(resultado){
            $("#mensajes").empty();
            for (var i = 0; i < resultado.length; i++) {
                if(Object.keys(resultado[i])[0]!= usuario){
                  $("#mensajes").append("<div class='aaaa'><div class='mensaje-entrante'><span>"+Object.keys(resultado[i])[0]+": </span><br><span>"+Object.values(resultado[i])[0]+"</span></div></div><br>");
                }else {
                  $("#mensajes").append("<div class='aaaa'><div class='mensaje-saliente'><span>"+Object.keys(resultado[i])[0]+": </span><br><span>"+Object.values(resultado[i])[0]+"</span></div></div><br>");
                }
              }
          },
          error:function(error){
            alert("error "+error.status);
          }
        });
      },500);
  }

  $("#enviar").click(function sendMensajes(e){
    if (usuario!=null) {
      if (selected!=undefined){
        if($("#mensaje").val()!=""){
          let data = {};
          data[usuario]=$("#mensaje").val();
          $.ajax({
            method:"POST",
            url:url+"/"+salaId+"/mensajes",
            data:data,
            beforeSend: function(xmlHttpRequest) {
              xmlHttpRequest.withCredentials = true;
            },
            success:function(){
              $("#mensaje").val("");
            },
            error:function(error){
              alert("error: "+ error.status);
            }
          });
          e.preventDefault();
        }else {
          alert("Escriba un mensaje primero!");
          e.preventDefault();
        }
      }else {
        alert("Seleccione una sala");
        e.preventDefault();
      }
    }else {
      alert("Inicie sesion para poder hablar y ver mensajes");
    }
  });

$(".controles-de-sala").hover(function cambiar(){
  $(this).css("background-color","#4cb050");
}).mouseout(function cambiar(){
  $(this).css("background-color","white");
});


$(".cerrar").hover(function cambiar(){
  $(this).css("background-color","red");
}).mouseout(function cambiar(){
  $(this).css("background-color","white");
});

$("#ingresar").on("click",function (){
  if($("#nombreDeUsuario").val()!=""){
    usuario=$("#nombreDeUsuario").val();
    $("#nombreDeUsuario").val("");
    $("#modal-iniciar").modal("hide");
    $("#user").text(usuario);
    $(".cerrar").show();
  }else {
    alert("Ingrese su nombre para continuar")
  }
});

$("#cerrar-sesion").on("click",function(){
  usuario=null;
  $("#user").text("Iniciar sesion");
  $(".cerrar").hide();
})

$(function(){
  $(".cerrar").hide();
})
