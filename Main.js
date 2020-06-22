var size_x = 0;
var size_y = 0;
var mine_count = 0;
var field = [];
$(function(){
    $('#field_select_dropdown > div > button').click(function(){
        process_field_choice(this.id);
        
    });
    $('#custom_field_submit').click(function(){
        var x = $('#width_field').val();
        var y = $('#height_field').val();
        var mines = $('#mine_count').val();
        
        var pattern = /^[1-9][0-9]?$/;
        if(pattern.test(x) === true && pattern.test(y) === true){
            var max_mines = Number(x) * Number(y);
            if (/^[1-9][0-9]*$/.test(mines) == true){
                if(Number(mines) <= max_mines){
                    size_x = Number(x);
                    size_y = Number(y);
                    mine_count = Number(mines);
                    $('.modall').remove();
                    configure_and_display_field();
                }
                else{
                    alert("Mine count is too big for the chosen field")
                }
            }
            else{
                alert("Fields can only contain positive integers")
            }
        }
        else{
            alert("Fields can only contain positive integers less than 100")
        }
        
        
        
    })
    
})

function process_field_choice(callerId){
    if(callerId === "4"){
        $('.modall').css("display","flex")
    }
    else if(callerId == "1"){
        size_x = 9;
        size_y = 9;
        mine_count = 10;
        configure_and_display_field();
        
    }
    else if(callerId == "2"){
        size_x = 16;
        size_y = 16;
        mine_count = 30;
        configure_and_display_field();
        
    }
    else if(callerId == "3"){
        size_x = 20;
        size_y = 40;
        mine_count = 60;
        configure_and_display_field();
        
    }
    
}

function configure_and_display_field(){
    $('#field_select_dropdown').remove();
    for(var y = 0; y < size_y; y++){
        var currentRow = [];
        for (var x = 0; x < size_x; x++){
            currentRow.push(-1);
        }
        field.push(currentRow);
    }
    var dim_x = size_x * 30;
    var dim_y = size_y * 30;
    $('#field_container').css({
        
        "width" : String(dim_x),
        "height" : String(dim_y)
        }
        
    )
    $('#field_container_background').css({
        "width" : String(dim_x + 30),
        "height" : String(dim_y + 30)
    })
    for (var i = 0; i < size_x * size_y; i++){
        $('#field_container').append(`
        <img src="Assets/Empty_square3dd.png" id=${i} ">
        `);
    }
    $('#field_container img').hover(function(){
        $('#' + this.id).attr("src","Assets/disabled_square.png")
        
    }, function(){
        $('#' + this.id).attr("src","Assets/Empty_square3dd.png")
    })
    $('#field_container_background').css("display","flex");
    
}