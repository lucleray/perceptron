//couleur du trait du perceptron
var couleurline = '#aaa'

function traceline(wx, wy, t) {
  //on cherche un point sur chaque "bords"
  var plinearr = new Array()
  if (wy != 0) {
    var y0 = t * 400 / wy
    var y400 = t * 400 / wy - wx / wy * 400
    if (y0 >= 0 && y0 <= 400) {
      plinearr.push({ x: 0, y: y0 })
    }
    if (y400 >= 0 && y400 <= 400) {
      plinearr.push({ x: 400, y: y400 })
    }
  }
  if (wx != 0) {
    var x0 = t * 400 / wx
    var x400 = t * 400 / wx - wy / wx * 400
    if (x0 >= 0 && x0 <= 400) {
      plinearr.push({ x: x0, y: 0 })
    }
    if (x400 >= 0 && x400 <= 400) {
      plinearr.push({ x: x400, y: 400 })
    }
  }

  if (
    plinearr.length >= 3 &&
    plinearr[0].y == plinearr[1].y &&
    plinearr[0].x == plinearr[1].x
  ) {
    plinearr = [plinearr[0], plinearr[2]]
  }

  //ouverture du contexte du canvas et raz du canvas
  var ctx = $('pline').getContext('2d')
  ctx.clearRect(0, 0, $('pline').getSize().x, $('pline').getSize().y)
  ctx.strokeStyle = couleurline
  ctx.lineWidth = 1

  $('horsecran').setStyle('display', 'none')

  if (plinearr.length >= 2) {
    //dessin de la ligne du perceptron
    ctx.beginPath()
    ctx.moveTo(plinearr[0].x, 400 - plinearr[0].y)
    ctx.lineTo(plinearr[1].x, 400 - plinearr[1].y)
    ctx.stroke()
    ctx.closePath()
  } else {
    $('horsecran').setStyle('display', 'block')
  }
}

function calcp(x, y) {
  var wx = $('corepx').get('value')
  var wy = $('corepy').get('value')
  var t = $('corept').get('value')
  if (wx * x + wy * y - t >= 0) {
    return 1
  } else {
    return -1
  }
}

function entrainep(echantillon) {
  var wx = $('corepx').get('value')
  var wy = $('corepy').get('value')
  var t = $('corept').get('value')
  wx = wx * 1
  wy = wy * 1
  t = t * 1
  var alpha = $('alpha').get('value')
  echantillon.each(function(item) {
    var r = calcp(item.x, item.y)
    if (item.c == 'red') {
      var ra = 1
    } else {
      var ra = -1
    }
    wx = wx + alpha * (ra - r) * item.x
    wy = wy + alpha * (ra - r) * item.y
    t = t + alpha * (ra - r) * -1
    wx = Math.round(wx * 10) / 10
    wy = Math.round(wy * 10) / 10
    t = Math.round(t * 10) / 10
    //alert(ra+' = '+r+' /// '+((alpha)*(ra-r)*(item.x))+' / '+((alpha)*(ra-r)*(item.y))+' / '+((alpha)*(ra-r)*(-1)));
  })
  if (
    $('corepx').get('value') == wx &&
    $('corepy').get('value') == wy &&
    $('corept').get('value') == t
  ) {
    var fin = true
  } else {
    var fin = false
  }
  $('corepx').set('value', wx)
  $('corepy').set('value', wy)
  $('corept').set('value', t)
  traceline(wx, wy, t)
  return fin
}

//variable qui vaut true quand l'apprentissage total est en cours et doit d'arreter
var arretappr = false

function entraineptot(echantillon) {
  $('load').set('src', 'css/load.gif')
  $('stop').setStyle('display', 'block')
  if (entrainep(echantillon) != true && arretappr != true) {
    setTimeout(function() {
      if (entrainep(echantillon) != true && arretappr != true) {
        entraineptot(echantillon)
      } else {
        $('load').set('src', 'css/loadf.gif')
        $('stop').setStyle('display', 'none')
        arretappr = false
        return true
      }
    }, 500)
  } else {
    $('load').set('src', 'css/loadf.gif')
    $('stop').setStyle('display', 'none')
    arretappr = false
    return true
  }
}

window.addEvent('domready', function() {
  //affiche la position du curseur
  var graphpos = $('graph').getPosition()
  var mousex = 0
  var mousey = 0
  $('graph').addEvent('mousemove', function(event) {
    mousex = event.page.x - graphpos.x
    $('mousex').set('text', mousex / 400)
    mousey = 400 - (event.page.y - graphpos.y)
    $('mousey').set('text', mousey / 400)
  })

  //selectionner entre ajouter/supprimer
  var actionp = 'add'
  $('addp').addEvent('click', function(e) {
    $('addp').addClass('select')
    $('movep').removeClass('select')
    $('deletep').removeClass('select')
    actionp = 'add'
    return false
  })
  $('movep').addEvent('click', function(e) {
    $('movep').addClass('select')
    $('deletep').removeClass('select')
    $('addp').removeClass('select')
    actionp = 'move'
    return false
  })
  $('deletep').addEvent('click', function(e) {
    $('addp').removeClass('select')
    $('movep').removeClass('select')
    $('deletep').addClass('select')
    actionp = 'delete'
    return false
  })

  //selectionner entre rouge/vert/bleu/jaune
  var colorp = 'red'
  $('redp').addEvent('click', function(e) {
    $$('#colorp a').removeClass('select')
    $('redp').addClass('select')
    colorp = 'red'
    return false
  })
  $('greenp').addEvent('click', function(e) {
    $$('#colorp a').removeClass('select')
    $('greenp').addClass('select')
    colorp = 'green'
    return false
  })
  /*	$('bluep').addEvent('click',function(e){
		$$('#colorp a').removeClass('select');
		$('bluep').addClass('select');
		colorp = 'blue';
		return false;
	});
	$('yellowp').addEvent('click',function(e){
		$$('#colorp a').removeClass('select');
		$('yellowp').addClass('select');
		colorp = 'yellow';
		return false;
	}); */

  //ajout de point
  var arrayp = new Array()
  var idp = 0
  $('graph').addEvent('click', function(e) {
    if (actionp == 'add') {
      //on rajoute le point sur le graph
      var pmx = mousex
      var pmy = mousey
      var npoint = new Element('div', {
        id: idp,
        styles: { top: 400 - pmy - 2, left: pmx - 2 }
      })
      npoint.addClass('point')
      npoint.addClass(colorp)
      $('graph').grab(npoint)
      //on rajoute le point dans le tableau
      arrayp[idp] = { x: pmx / 400, y: pmy / 400, c: colorp }

      //on rajoute le point dans la liste
      var nplist = new Element('li', {
        id: 'lp' + idp
      })
      nplist.set(
        'html',
        '<div class="ppoint" style="background:' +
          colorp +
          '"></div>' +
          '<div>' +
          idp +
          '</div>' +
          '<div><span>' +
          pmx / 400 +
          '</span></div>' +
          '<div><span>' +
          pmy / 400 +
          '</span></div>' +
          '<hr />'
      )
      $('ulist').grab(nplist)

      //on rajoute la suppression possible du point cr��
      npoint.addEvent('click', function() {
        if (actionp == 'delete') {
          var idpp = npoint.get('id')
          //suppression de la liste
          $('lp' + idpp).destroy()

          //suppression du tableau
          arrayp[idpp] = null

          //suppression du point
          npoint.destroy()
        }
        return false
      })

      //on rajoute le d�placement du point
      new Drag.Move(npoint, {
        container: $('graph'),
        droppables: [$('graph')],
        onSnap: function() {
          if (actionp != 'move') {
            this.stop()
          }
        },
        onDrop: function() {
          var idpp = npoint.get('id')
          arrayp[idpp].x = mousex
          arrayp[idpp].y = mousey

          $$('#lp' + idpp + ' div span')[0].set('html', mousex)
          $$('#lp' + idpp + ' div span')[1].set('html', mousey)
        }
      })

      idp += 1
    }
    return false
  })

  //on change le perceptron d�s qu'un poids est chang�
  $$('#corep input').addEvent('keyup', function() {
    var wx = $('corepx').get('value')
    var wy = $('corepy').get('value')
    var t = $('corept').get('value')
    traceline(wx, wy, t)
  })

  //entrainement simple quand on appuie sur simple
  $('csimple').addEvent('click', function() {
    entrainep(arrayp)
    return false
  })

  //entrainement total quand on appuie sur total
  $('ctotal').addEvent('click', function() {
    entraineptot(arrayp)
    return false
  })

  //fonction de remise � z�ro
  $('raz').addEvent('click', function() {
    location.reload()
    return false
  })

  //stopper l'apprentissage total
  $('stop').addEvent('click', function() {
    arretappr = true
    return false
  })

  //trac� au d�but
  traceline(
    $('corepx').get('value'),
    $('corepy').get('value'),
    $('corept').get('value')
  )

  //fonction pour ajouter une aide sur un �l�ment
  var textedefautaide = $('aide').get('html')
  function aide(idelement, texteaide) {
    $(idelement).addEvent('mouseover', function() {
      $('aide').set('html', texteaide)
    })
    $(idelement).addEvent('mouseleave', function() {
      $('aide').set('html', textedefautaide)
    })
  }

  //partie aide
  aide('raz', 'Remise à zéro du perceptron')
  aide(
    'graph',
    "Cliquez pour ajouter/déplacer/supprimer un point (choisissez le mode à l'aide des liens sous le graphe)"
  )
  aide(
    'addp',
    'Lorsque ce mode est sélectionné, vous ajoutez des points sur le graphe'
  )
  aide(
    'movep',
    'Lorsque ce mode est sélectionné, vous déplacez les points sur le graphe'
  )
  aide(
    'deletep',
    'Lorsque ce mode est sélectionné, vous supprimez les points sur le graphe'
  )
  aide('redp', 'Les points ajoutés sur le graphe seront rouges')
  aide('greenp', 'Les points ajoutés sur le graphe seront verts')
  aide('corepx', 'Cliquez pour modifier le poids de x dans le perceptron')
  aide('corepy', 'Cliquez pour modifier le poids de y dans le perceptron')
  aide('corept', 'Cliquez pour modifier le seuil dans le perceptron')
  aide(
    'alphadiv',
    "Cliquez pour modifier le coefficient d'apprentissage du perceptron"
  )
  aide('csimple', "Effectuez une seule étape d'apprentissage")
  aide(
    'ctotal',
    "Effectuez l'apprentissage jusqu'à ce que tout les points soient correctement classés"
  )
  aide('list', 'Liste des points déjà ajoutés')
})
