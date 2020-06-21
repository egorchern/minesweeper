$(function(){
    $('#field_select_dropdown > div > button').click(function(){
        process_field_choice(this.id);
        
    })
})

function process_field_choice(callerId){
    if(callerId === "4"){
        $('.modall').css("display","flex")
    }
}