$( document ).ready(function() {

    init();

});

const connectfour = ".wood-board";
const columns  = 7;
const rows  = 6;
var player = 1;

const init = () => {

    grid();

    eventListener();
}

const grid = () => {

    let rows_cols;

    for(y = 1; y <= rows; y++){

        row_columns = $(`<div id="row_${y}" class="rows">`);
        
        for(x = 1; x <= columns; x++){
            row_columns.append(`<div id="row_${y}-col_${x}" class="cols empty">`);
        }

        $(connectfour).append(row_columns);
    }

}

const checkhole = (obj) => {

    let item, select_hole;

    for(i=1; i<=rows; i++){
        item = `row_${i}-${obj.col_loc}`;
        
        if($("#" + `${item}`).hasClass('empty')){
            select_hole = item; 
        }
    }

    return select_hole;
}


const inserthole = (obj,checkhole) => {

    switch(player){
        case 1:
            $(`#${checkhole}`).css('background', 'black').removeClass(`empty`).attr(`value`, `${player}`);
            next_player = {'next':2,'orig':1}; 
        break;
        case 2:
            $(`#${checkhole}`).css('background', 'red').removeClass(`empty`).attr(`value`, `${player}`);
            next_player = {'next':1,'orig':2}; 
        break;
    }

    return next_player;
}

const show_winner = (player) => {

    switch(player){
        case 1:
            $('.show_winner').css(`color`,`black`).html(`<h1>Result : Player 1 Winner</h1>`);
          
                resetFlds();
           
        break;
        case 2:
            $('.show_winner').css(`color`,`red`).html(`<h1>Result : Player 2 Winner</h1>`);

                resetFlds();

        break;
    }
}

const resetFlds = () => {

    let not_empty = $('.rows').find('.cols');

    not_empty.removeAttr('value');
    not_empty.removeAttr('style');
    not_empty.removeClass('empty');
    not_empty.addClass('empty');

    
    $(`#move`).css(`color`,`black`).html(`<h1>Player 1 Move</h1>`);

    var player = 1;

}

const eventListener = () => {


    $( "#reset" ).on( "click", function() {

        resetFlds();

        var player = 1;
     });


    $( ".cols" ).on( "click", function() {

        $('.show_winner').empty();
        
        
       let id_selector =  $(this).attr('id');
       let split_val   =  $(this).attr('id').split('-');

       let obj_params  = {
        id: id_selector,
        row_loc: split_val[0],
        col_loc: split_val[1]
       };


       checkhole_var = checkhole(obj_params);

       next_player = inserthole(obj_params, checkhole_var);

       winner_trigg = checkwinner(obj_params, checkhole_var);



       if(winner_trigg){
        next_player = show_winner(next_player['orig']);
      
      }
   
   
    process(obj_params,next_player);

    });

}

const process = (obj,next_player) => {
        
            draw_var = draw();
            if(!draw_var){
                player = next_player['next'];

                switch(player){
                    case 1:
                        $(`#move`).css(`color`,`black`).html(`<h1>Player 1 Move</h1>`);
                    break;
                    case 2:
                        $(`#move`).css(`color`,`red`).html(`<h1>Player 2 Move</h1>`);
                    break;
                }
            }else{
                $(`.show_winner`).css(`color`,`black`).html(`<h1> Result : Draw</h1>`);
                resetFlds();
            }
}

const checkwinner = (obj, checkhole_var) => {


     let vertical   = false;
     
     let horizontal = false;
     
     let diagonal   = false;
     
     
    vertical       = Vertical(obj,checkhole_var);
    horizontal     = Horizontal(obj, checkhole_var);
    diagonal       = Diagonal(obj,checkhole_var);

     if(vertical || horizontal || diagonal){
        return true;
     }
}

const draw = () => {

    let count = 0;

    $('.cols').each(function(i, obj) {
         if($(this).hasClass(`empty`)){
            count++;
         }
    });

    return (count > 0) ? false : true;
  
}

const Vertical = (obj, checkhole_var) => {

    let vertical   = false;
    let split_val       = checkhole_var.split('-');
    let split_row       = split_val[0].split('_');
    let split_col       = split_val[1].split('_');
    let row         = parseInt(split_row[1]);
    let col         = parseInt(split_col[1]);
    let vert_score        = 0; 
    let f_score    = 0;

    if( (row + 1 )  <= 7){ 
       
       let vert_score = (row + 1);
       
       for(i=vert_score; i<=7; i++){
          
           if( (!$(`#row_${i}-col_${col}`).hasClass(`empty`)) && (parseInt($(`#row_${i}-col_${col}`).attr(`value`)) === player ) ){
            vert_score++;
             
               if((vert_score + 1) === 4){ 
                   vertical = true;
                   break;
               }
           }else{
               break;
           }
           
       }
       return vertical;

   }
    

}

const Horizontal = (obj, checkhole_var) => {

     let horizontal = false;
     let split_val       = checkhole_var.split('-');
     let split_row       = split_val[0].split('_');
     let split_col       = split_val[1].split('_');
     let row         = parseInt(split_row[1]);
     let col         = parseInt(split_col[1]);
     let left_sc       = 0; 
     let right_sc       = 0; 
     let f_score    = 0;

     if( ((col-1) >= 1) || ((col+1) <= 7)){ 
        
        let left = (col - 1); 
        
        for(i=left; i>=1; i--){

            if( (!$(`#row_${row}-col_${i}`).hasClass(`empty`)) && (parseInt($(`#row_${row}-col_${i}`).attr(`value`)) === player ) ){
                left_sc++; 

                if((left_sc+1) === 4){ 
                    horizontal = true;
                    break;
                }
            }else{
                break;
            }
            
        }
         let right = (col + 1); 
        
         for(i=right; i<=7; i++){
            
             if( (!$(`#row_${row}-col_${i}`).hasClass(`empty`)) && (parseInt($(`#row_${row}-col_${i}`).attr(`value`)) === player ) ){
                right_sc++;
               
                 if((right_sc+1) === 4){ 
                    horizontal = true;
                     break;
                 }
             }else{
                 break;
             }
             
         }
         

         if(left_sc && right_sc){
            f_score = left_sc + right_sc + 1; 

            if(f_score === 4){
                horizontal = true;
            }
        }

        return horizontal;

    }
     

}



const Diagonal = (obj, checkhole_var) => {

    let diagonal   = false;
    let split_val       = checkhole_var.split('-');
    let split_row       = split_val[0].split('_');
    let split_col       = split_val[1].split('_');
    let row         = parseInt(split_row[1]);
    let col         = parseInt(split_col[1]);
    let dlu_sc      = 0; 
    let dld_sc      = 0; 
    let dur_sc      = 0; 
    let ddr_sc      = 0; 
    let f_score    = 0;
    let insc    = 1;


    insc = 1; 
    let dlu_col_sc = (col - insc); 
    let dlu_row_sc = (row - insc); 
    
    if( ( (dlu_row_sc <= 7) && (dlu_col_sc <= 7)) ) {
      
        for(i=dlu_col_sc; i>=1; i--){
            dlu_col_sc = (col - insc); 
            dlu_row_sc = (row - insc); 
           
            if( (!$(`#row_${dlu_row_sc}-col_${dlu_col_sc}`).hasClass(`empty`)) && (parseInt($(`#row_${dlu_row_sc}-col_${dlu_col_sc}`).attr(`value`)) === player ) ){
               
                dlu_sc++; 
                if((dlu_sc+1) === 4){ 
                    diagonal = true;
                    break;
                }
            }else{
                break;
            }
            insc++;   
        }
            

        insc = 1;
        let ddr_col_sc = (col + insc);
        let ddr_row_sc = (row + insc); 
        for(i=ddr_row_sc; i<=7; i++){
            ddr_col_sc = (col + insc); 
            ddr_row_sc = (row + insc); 
            
            if( (!$(`#row_${ddr_row_sc}-col_${ddr_col_sc}`).hasClass(`empty`)) && (parseInt($(`#row_${ddr_row_sc}-col_${ddr_col_sc}`).attr(`value`)) === player ) ){
               
                ddr_sc++;  
                if((ddr_sc+1) === 4){ 
                    diagonal = true;
                    break;
                }
            }else{
                break;
            }
            insc++;   
        }
        
        if(dlu_sc && ddr_sc){
           f_score = dlu_sc + ddr_sc + 1; 

           if(f_score === 4){
            diagonal = true;
           }
       }
    }

    let dld_col_sc = (col - insc); 
    let dld_row_sc = (row + insc); 
    
    if( (dld_col_sc >= 1)  && (dld_row_sc <= 7)) { 

        for(i=dld_col_sc; i>=1; i--){
            dld_col_sc = (col - insc); 
            dld_row_sc = (row + insc); 
           
            if( (!$(`#row_${dld_row_sc}-col_${dld_col_sc}`).hasClass(`empty`)) && (parseInt($(`#row_${dld_row_sc}-col_${dld_row_sc}`).attr(`value`)) === player ) ){
               
                dld_sc++; 

                if((dld_sc+1) === 4){ 
                    diagonal = true;
                    break;
                }
            }else{
                break;
            }
            insc++;   
        }
            
        insc = 1; 
        let dru_col_sc = (col + insc); 
        let dru_row_sc = (row - insc); 

        for(i=dru_row_sc; i<=7; i++){
            dru_col_sc = (col + insc); 
            dru_row_sc = (row - insc); 
           

            if( (parseInt($(`#row_${dru_row_sc}-col_${dru_col_sc}`).attr(`value`)) === player ) ){
               
                dur_sc++; 
                if((dur_sc+1) === 4){ 
                    diagonal = true;
                    break;
                }
            }else{
                break;
            }
            insc++;   
        }

        
        if(dld_sc && dur_sc){
           f_score = dld_sc + dur_sc + 1; 

           if(f_score === 4){
            diagonal = true;
           }
       }
    }


    return diagonal;

}

