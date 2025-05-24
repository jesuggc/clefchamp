let easyChart, normalChart, hardChart;

function crearGraficoAreaspline(divId, datos) {
  return Highcharts.chart(divId, {
    chart: {
      type: 'areaspline',
      backgroundColor: '#dccfca',
      borderRadius: 10,
      zoomType: '' // Desactiva zoom manual
    },
    title: { text: '' },
    xAxis: {
      type: 'datetime',
      labels: { style: { color: '#000' } }
    },
    yAxis: {
      title: { text: '' },
      labels: { style: { color: '#000' } },
      gridLineColor: 'rgba(255,255,255,0.2)'
    },
    series: [{
      name: 'Puntuación',
      data: datos,
      color: 'rgba(57, 181, 255, 0.8)',
      lineColor: '#69c4ff',
      lineWidth: 2,
      fillOpacity: 0.3,
      marker: {
        enabled: false
      }
    }],
    legend: { enabled: false },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      style: { color: '#FFF' },
      formatter: function () {
        return `<b>${Highcharts.dateFormat('%d %b %Y', this.x)}</b>: ${this.y}`;
      }
    },
    credits: { enabled: false }
  });
}

function transformarDatos(datos) {
  return datos.map(item => [
    Date.UTC(
      new Date(item.fecha).getUTCFullYear(),
      new Date(item.fecha).getUTCMonth(),
      new Date(item.fecha).getUTCDate()
    ),
    item.puntos
  ]);
}

async function fetchStatsForUser() {
  try {
    const response = await fetch("/users/statsForUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener stats del usuario:", error);
    return null;
  }
}

function aplicarZoom(chart, dias) {
    if (!chart || dias === 'all') {
      chart?.xAxis[0].setExtremes(null, null);
      return;
    }
  
    const data = chart.series[0].data;
    if (!data.length) return;
  
    const ultimaFecha = data[data.length - 1].x; // Fecha de la última partida
    const desde = ultimaFecha - (dias * 24 * 60 * 60 * 1000);
  
    chart.xAxis[0].setExtremes(desde, ultimaFecha);
  }
  
document.addEventListener("DOMContentLoaded", function () {
  fetchStatsForUser().then(stats => {
    if (stats) {
      console.log(stats.easyStats)
      const bestScoreData = obtenerPuntuacionMaxima(stats.easyStats);
      $("#bestScoreEasy").text(bestScoreData.puntos);
      $("#bestDateEasy").text(bestScoreData.fecha);
      const lastPlayedData = obtenerUltimaFecha(stats.easyStats);
      $("#lastPlayedEasy").text(lastPlayedData);
      if (stats.easyStats.length > 2) {
        $("#easyStats").removeClass("d-none");
        $("#easyNoData").addClass("d-none");
        easyChart = crearGraficoAreaspline('easyStats', transformarDatos(stats.easyStats));
      } else {
        $("#easyStats").addClass("d-none");
        $("#easyNoData").removeClass("d-none");
      }

      if (stats.normalStats.length > 2) {
        $("#normalStats").removeClass("d-none");
        $("#normalNoData").addClass("d-none");
        normalChart = crearGraficoAreaspline('normalStats', transformarDatos(stats.normalStats));
      } else {
        $("#normalStats").addClass("d-none");
        $("#normalNoData").removeClass("d-none");
      }

      if (stats.hardStats.length > 2) {
        $("#hardStats").removeClass("d-none");
        $("#hardNoData").addClass("d-none");
        hardChart = crearGraficoAreaspline('hardStats', transformarDatos(stats.hardStats));
      } else {
        $("#hardStats").addClass("d-none");
        $("#hardNoData").removeClass("d-none");
      }
    }
  });

  // Manejo de botones de zoom
  document.getElementById('rangoControles').addEventListener('click', function (e) {
    if (e.target.matches('button[data-rango]')) {
      const valor = e.target.getAttribute('data-rango');
      const rangoDias = valor === 'all' ? 'all' : parseInt(valor);

      aplicarZoom(easyChart, rangoDias);
      aplicarZoom(normalChart, rangoDias);
      aplicarZoom(hardChart, rangoDias);
    }
  });
}); 


function obtenerUltimaFecha(data) {
  const ultima = data.reduce((a, b) => (b.fecha > a.fecha ? b : a));
  const fecha = new Date(ultima.fecha);
  const dia = String(fecha.getDate()-1).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const año = fecha.getFullYear();
  
  return `${dia}-${mes}-${año}`;
}

// Puntuación máxima
function obtenerPuntuacionMaxima(data) {
  const max = data.reduce((a, b) => (b.puntos > a.puntos ? b : a));
  const fecha = new Date(max.fecha);
  const dia = String(fecha.getDate()-1).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const año = fecha.getFullYear();
  
  return {
    puntos: max.puntos,
    fecha: `${dia}-${mes}-${año}`
  };
}


$("#easyBtn").addClass("bg-10");
$("#easyBtn").on("click", function() {
  $(".easyDiv").prop('hidden', false);
  $(".normalDiv").prop('hidden', true);
  $(".hardDiv").prop('hidden', true);
  $("#easyBtn").addClass("bg-10");
  $("#normalBtn").removeClass("bg-10");
  $("#hardBtn").removeClass("bg-10");
})

$("#normalBtn").on("click", function() {
  $(".easyDiv").prop('hidden', true);
  $(".normalDiv").prop('hidden', false);
  $(".hardDiv").prop('hidden', true);
  $("#easyBtn").removeClass("bg-10");
  $("#normalBtn").addClass("bg-10");
  $("#hardBtn").removeClass("bg-10");
})

$("#hardBtn").on("click", function() {
  $(".easyDiv").prop('hidden', true);
  $(".normalDiv").prop('hidden', true);
  $(".hardDiv").prop('hidden', false);
  $("#easyBtn").removeClass("bg-10");
  $("#normalBtn").removeClass("bg-10");
  $("#hardBtn").addClass("bg-10");
})

