var ROWS = 10;
var COLUMNS = 20;

var TILES = [];  // Matrix of tiles (td elements)

function flag_tile(td) {
  var td = $(td);
  if (td.hasClass('flagged')) {
    td.removeClass().addClass('unopened');
  } else {
    td.removeClass().addClass('flagged');
  }
}

function open_tile(td, unvealing_all = false) {
  var td = $(td);
  if (!td.hasClass('unopened')) {
    return;
  }

  var row = td.data('row');
  var column = td.data('column');
  console.log("Opening tile " + row + ", " + column);

  if (TILES[row][column].data('mined')) {
    td.removeClass().addClass('mine');
    if (!unvealing_all) {
      unveal_all();
    }
  } else {
    var neighbour_mines = count_neighbour_mines(td);
    if (neighbour_mines == 0) {
      td.removeClass().addClass('opened');

      if (!unvealing_all) {
        var the_neighbours = neighbours(td);
        for (var i = 0; i < the_neighbours.length; i++) {
          open_tile(the_neighbours[i]);
        }
      }
    } else {
      td.removeClass().addClass('mine-neighbour-' + neighbour_mines);
    }
  }
}

function roll_dice() {
  return Math.round(Math.random() * 6) + 1;
}

function unveal_all() {
  $('td.unopened').each(function(i, item) {
    open_tile(item, true);
  });
}

function count_neighbour_mines(td) {
  var neighbour_mines = 0;
  var the_neighbours = neighbours(td);
  for (var i = 0; i < the_neighbours.length; i++) {
    var column = the_neighbours[i].data('column');
    var row = the_neighbours[i].data('row');
    if (TILES[row][column].data('mined')) {
      neighbour_mines++;
    }
  }
  return neighbour_mines;
}

function neighbours(td) {
  var td = $(td);
  var row = td.data('row');
  var column = td.data('column');
  var the_neighbours = [];

  for (var row_offset = -1; row_offset <= 1; row_offset++) {
    for (var column_offset = -1; column_offset <= 1; column_offset++) {
      if (row_offset != 0 || column_offset != 0) {
        var neighbour_row = row + row_offset;
        var neighbour_column = column + column_offset;
        if (within_range(neighbour_row, neighbour_column)) {
          the_neighbours.push(TILES[neighbour_row][neighbour_column]);
        }
      }
    }
  }

  return the_neighbours;
}

function within_range(row, column) {
  if (row < 0 || row >= TILES.length) {
    return false;
  }
  if (column < 0 || column >= TILES[0].length) {
    return false;
  }
  return true;
}

function initialize(minesweep) {
  for (var row = 0; row < ROWS; row++) {
    var tr = $('<tr />');
    TILES[row] = [];

    for (var column = 0; column < COLUMNS; column++) {
      var td = $('<td class="unopened" />').data({
        row: row,
        column: column,
        mined: (roll_dice() == 6)
      });
      TILES[row][column] = td;
      tr.append(td);
    }
    minesweep.append(tr);
  }
}

$(document).ready(function() {
  document.oncontextmenu = function() {return false;};

  var minesweep = $('#minesweep');
  initialize(minesweep);
  minesweep.find('td').on('mousedown', function(event) {
    switch (event.which) {
      case 3:  // Right click
        flag_tile(event.target);
        break;
      default:
        open_tile(event.target);
    }
  });
});