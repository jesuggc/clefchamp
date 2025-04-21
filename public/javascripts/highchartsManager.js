function crearGraficoAreaspline(divId, datos) {
  Highcharts.chart(divId, {
      chart: {
          type: 'areaspline',
          backgroundColor: '#dccfca',
          borderRadius: 10
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
          credentials: "include" // Para enviar cookies si la sesión está basada en ellas
      });

      if (!response.ok) {
          throw new Error(`Error en la petición: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error al obtener stats del usuario:", error);
      return null;
  }
}
document.addEventListener("DOMContentLoaded", function () {
  fetchStatsForUser().then(stats => {
      if (stats) {
        if(stats.easyStats.length > 2) {
            $("#easyStats").removeClass("d-none");
            $("#easyNoData").addClass("d-none");
            crearGraficoAreaspline('easyStats', transformarDatos(stats.easyStats));
        } else {
            $("#easyStats").addClass("d-none");
            $("#easyNoData").removeClass("d-none");
        }
        
        if(stats.normalStats.length > 2) {
            $("#normalStats").removeClass("d-none");
            $("#normalNoData").addClass("d-none");
            crearGraficoAreaspline('normalStats', transformarDatos(stats.normalStats));
        } else {
            $("#normalStats").addClass("d-none");
            $("#normalNoData").removeClass("d-none");
        }
        
        if(stats.hardStats.length > 2) {
            $("#hardStats").removeClass("d-none");
            $("#hardNoData").addClass("d-none");
            crearGraficoAreaspline('hardStats', transformarDatos(stats.hardStats));
        } else {
            $("#hardStats").addClass("d-none");
            $("#hardNoData").removeClass("d-none");
        }
      }
  });
});
