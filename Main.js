var size_x = 0;
var size_y = 0;
var mine_count = 0;
var field = [];
var firstClick = true;
var mine_locations = [];
var visited_nodes = [];
var time_elapsed = 0;
var timer;
var flags_placed = 0;

function display_help_modal()
{
    $('#help_icon').removeClass("blue-pulse");
    $('.modall-content').empty();
    $('.modall-content').append(
        `

        `
    )
    $('.modall').css("display","flex");
}

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
            var max_mines = Number(x) * Number(y) - 8;
            if (/^[1-9][0-9]*$/.test(mines) == true){
                if(Number(mines) <= max_mines){
                    size_x = Number(x);
                    size_y = Number(y);
                    mine_count = Number(mines);
                    $('.modall').remove();
                    configure_and_display_field();
                }
                else{
                    alert("Mine count is too big for the chosen field");
                }
            }
            else{
                alert("Fields can only contain positive integers");
            }
        }
        else{
            alert("Fields can only contain positive integers less than 100");
        }
        
        
        
    })
    
})
function visited_nodes_includes(coord)
{
    for (var i = 0; i < visited_nodes.length; i++)
    {
        var current_coord = visited_nodes[i];
        if (coord[0] === current_coord[0] && coord[1] === current_coord[1])
        {
            return true;
        }
        
    }
    return false;
}

function mine_field_includes(coord)
{
    for (var i = 0; i < mine_locations.length; i++)
    {
        var current_coord = mine_locations[i];
        if (coord[0] === current_coord[0] && coord[1] === current_coord[1])
        {
            return true;
        }
        
    }
    return false;
}
function update_time_elapsed()
{
    time_elapsed += 1;
    $('#time').html(String(time_elapsed));
}
function process_field_choice(callerId)
{
    
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
    $('#mines').html(String(mine_count));
    timer = setInterval(update_time_elapsed, 1000);
    $('#timer_and_flag_container').css("display","flex");
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
    
    for(var y = 0; y < size_y; y++)
    {
        for(var x = 0; x < size_x; x++)
        {
            $('#field_container').append(
            `
            <img src="Assets/Empty_square3dd.png" id='${y}_${x}'>
            `
            );
        }
    }
        
    
    $('#field_container img').hover(function(){
        $('#' + this.id).attr("src","Assets/disabled_square.png")
        
    }, function(){
        $('#' + this.id).attr("src","Assets/Empty_square3dd.png")
    })
    $('#field_container img').click(function(){
        processClick(this.id);
    });
    $('#field_container img').on('contextmenu', function(ev){
        ev.preventDefault();
        var source = $(`#${this.id}`).attr("src");
        console.log(source);
        if (source === "Assets/disabled_square.png")
        {
            $(`#${this.id}`).off('click');
            $(`#${this.id}`).off('mouseenter');
            $(`#${this.id}`).off('mouseleave');
            $(`#${this.id}`).attr('src',"Assets/unclicked_square_flagged.png");
            flags_placed += 1;
            
        }
        else if(source === "Assets/unclicked_square_flagged.png")
        {
            
            $(`#${this.id}`).click(function(){
                processClick(this.id);
            })
            $(`#${this.id}`).hover(function()
                {
                
                $('#' + this.id).attr("src","Assets/disabled_square.png")

                }, function(){
                
                $('#' + this.id).attr("src","Assets/Empty_square3dd.png")
                
                })
            $(`#${this.id}`).attr("src", "Assets/Empty_square3dd.png");
            flags_placed -= 1;
            
        }
        $('#flags').html(String(flags_placed));
        
    });
    $('#field_container_background').css("display","flex");
    
}

function processClick (callerId)
{
    
    var y = Number(/^\d+/.exec(callerId)[0]);
    var x = Number(/\d+$/.exec(callerId)[0]);
    
    
    if(firstClick === true)
    {
        mine_locations = [[y, x]];
        if(y - 1 > -1 && x - 1 > -1)
        {
            mine_locations.push([y - 1, x - 1])
        }
        if(y + 1 < size_y && x - 1 > -1)
        {
            mine_locations.push([y + 1, x - 1])
        }
        if(y - 1 > -1 && x + 1 < size_x)
        {
            mine_locations.push([y - 1, x + 1])
        }
        if(y + 1 < size_y && x + 1 < size_x)
        {
            mine_locations.push([y + 1, x + 1])
        }
        if(y - 1 > -1)
        {
            mine_locations.push([y - 1, x])
        }
        if(y + 1 < size_y)
        {
            mine_locations.push([y + 1, x])
        }
        if(x + 1 < size_x)
        {
            mine_locations.push([y, x + 1])
        }
        if(x - 1 > -1)
        {
            mine_locations.push([y, x - 1])
        }
        
        for (var i = 0; i < mine_count; i++)
        {
            var rand_y = randomInteger(0, size_y - 1);
            var rand_x = randomInteger(0, size_x - 1);
            var coord = [rand_y, rand_x];
            
            while(mine_field_includes(coord) === true)
            {
                
                rand_y = randomInteger(0, size_y - 1);
                rand_x = randomInteger(0, size_x - 1);
                coord = [rand_y, rand_x];
            }
            mine_locations.push(coord);
            
            field[rand_y][rand_x] = 2;
            
        }
        reveal_around(y, x);
        firstClick = false;
        
        
    }
    else
    {
        if(field[y][x] == 2)
        {
            clearInterval(timer);
            var audio = new Audio('Assets/explosion.wav');
            audio.play();
            reveal_mines(y, x);
            
            $('#field_container img').off();
            
        }
        else
        {
            reveal_around(y, x);
            var game_state = check_win_condition();
            if (game_state === true)
            {
                clearInterval(timer);
                $('#field_container img').off();
                $('#alertMessageContainer').append(`
                    <div class="alert alert-success fade show" role="alert" id="bookmarkAlert" style="width:100%;margin:auto;margin-top:10px;max-width:600px;">
                        You have successfully minesweeped a <strong>${size_x} x ${size_y}</strong> field with <strong<${mine_count}</strong> mines. It took you <strong>${time_elapsed}</strong> seconds!
                    </div>

                `);
                $('#timer_and_flag_container').hide();
                $('#alertMessageContainer').show();
            }
        }
    }
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function adjecent_mine_count(y, x)
{
    var counter = 0;
    if(field[y][x] == 2)
    {
        return -1;
    }
    if(y - 1 > -1 && x - 1 > -1 && field[y - 1][x - 1] == 2)
    {
        counter += 1;
    }
    if(y + 1 < size_y && x - 1 > -1 && field[y + 1][x - 1] == 2)
    {
        counter += 1;
    }
    if(y - 1 > -1 && x + 1 < size_x && field[y - 1][x + 1] == 2)
    {
        counter += 1;
    }
    if(y + 1 < size_y && x + 1 < size_x && field[y + 1][x + 1] == 2)
    {
        counter += 1;
    }
    if(y - 1 > -1 && field[y - 1][x] == 2)
    {
        counter += 1;
    }
    if(y + 1 < size_y && field[y + 1][x] == 2)
    {
        counter += 1;
    }
    if(x + 1 < size_x && field[y][x + 1] == 2)
    {
        counter += 1;
    }
    if(x - 1 > -1 && field[y][x - 1] == 2)
    {
        counter += 1;
    }
    return counter;
}

function reveal_around(y, x)
{
    visited_nodes.push([y, x]);
    var adjecentMines = adjecent_mine_count(y, x);
    
    if(adjecentMines > 0)
    {
            
        $(`#${y}_${x}`).attr("src",`Assets/disabled_square_${adjecentMines}.png`);
        $(`#${y}_${x}`).off();
        
            
    }
    else if(adjecentMines == 0)
    {
        $(`#${y}_${x}`).attr("src",`Assets/disabled_square.png`);
        $(`#${y}_${x}`).off();
        
        if(y - 1 > -1 && x - 1 > -1 && visited_nodes_includes([y - 1, x - 1]) === false)
        {
            reveal_around(y - 1, x - 1);
        }
        if(y + 1 < size_y && x - 1 > -1 && visited_nodes_includes([y + 1, x - 1]) === false )
        {
            reveal_around(y + 1, x - 1);
        }
        if(y - 1 > -1 && x + 1 < size_x && visited_nodes_includes([y - 1, x + 1]) === false)
        {
            reveal_around(y - 1, x + 1);
        }
        if(y + 1 < size_y && x + 1 < size_x && visited_nodes_includes([y + 1, x + 1]) === false)
        {
            
            reveal_around(y + 1, x + 1);
        }
        if(y - 1 > -1 && visited_nodes_includes([y - 1, x]) === false)
        {
            reveal_around(y - 1, x);
        }
        if(y + 1 < size_y && visited_nodes_includes([y + 1, x]) === false)
        {
            reveal_around(y + 1, x - 1);
        }
        if(x + 1 < size_x && visited_nodes_includes([y, x + 1]) === false)
        {
            reveal_around(y, x + 1);
        }
        if(x - 1 > -1 && visited_nodes_includes([y , x - 1]) === false)
        {
            reveal_around(y, x - 1);
        }
    }
                
}
function reveal_mines(y, x)
{
    for(var y = 0; y < size_y; y++)
    {
        for(var x = 0; x < size_x; x++)
        {
            if(field[y][x] == 2)
            {
                $(`#${y}_${x}`).attr("src", "Assets/square_unclicked_bomb.png");
            }
        }
    }
}

function check_win_condition() // false - game still in process, true - game won 
{
    for(var y = 0; y < size_y; y++)
    {
        for(var x = 0; x < size_x; x++)
        {
            if(field[y][x] != 2)
            {
                if(visited_nodes_includes([y, x]) === false)
                {
                    return false;
                }
            }
            
        }
    }
    return true;
}