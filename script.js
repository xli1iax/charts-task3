Chart.register(ChartDataLabels);

fetch('z03.xml')
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "application/xml");

        if (xmlDoc.querySelector("parsererror")) {
            console.error("Помилка парсингу XML");
            return;
        }

        const years = [];
        const gradeLabels = ["A", "B", "C", "D", "E", "FX", "FN"];
        const gradeData = {
            A: [], B: [], C: [], D: [], E: [], FX: [], FN: []
        };

        const records = xmlDoc.getElementsByTagName('zaznam');
        Array.from(records).forEach(record => {
            const year = record.getElementsByTagName('rok')[0].textContent;
            years.push(year);

            gradeLabels.forEach(label => {
                const gradeElement = record.getElementsByTagName(label)[0];
                const gradeCount = gradeElement ? parseInt(gradeElement.textContent) : 0;
                gradeData[label].push(gradeCount);
            });
        });

        const datasets = gradeLabels.map((label, index) => ({
            label: label,
            data: gradeData[label],
            backgroundColor: `rgba(${50 * index}, ${100 + 20 * index}, ${200 - 30 * index}, 0.6)`,
            borderColor: `rgba(${50 * index}, ${100 + 20 * index}, ${200 - 30 * index}, 1)`,
            borderWidth: 1
        }));

        const colors = [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 0, 0, 0.6)'
        ];

        new Chart(document.getElementById('groupedChart'), {
            type: 'bar',
            data: {
                labels: years,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of students'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Distribution of grades by year'
                    },
                    datalabels: {
                        offset: -5,
                        anchor: 'end',
                        align: 'top'
                    }
                }
            },
            plugins: [ChartDataLabels]
        });


        years.forEach((year, index) => {
            const ctx = document.createElement('canvas');
            ctx.id = `verticalChart${index}`;
            ctx.classList.add('vert-chart');

            document.getElementById('verticalChart').appendChild(ctx);
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: gradeLabels,
                    datasets: [{
                        label: `Number of students ${year}`,
                        data: gradeLabels.map(label => gradeData[label][index]),
                        backgroundColor: colors,
                        hoverOffset: 4
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: `${year} year grade distribution`
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Grades'
                            },
                            beginAtZero: true,
                            ticks: {
                                autoSkip: false,
                                maxRotation: 0,
                                minRotation: 0
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Number of students'
                            },
                            beginAtZero: true
                        }

                    }
                }
            });
        });


        years.forEach((year, index) => {
            const ctx = document.createElement('canvas');
            ctx.id = `pieChart${index}`;
            ctx.classList.add('pie-chart');

            document.getElementById('pieChartsContainer').appendChild(ctx);
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: gradeLabels,
                    datasets: [{
                        data: gradeLabels.map(label => gradeData[label][index]),
                        backgroundColor:colors,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: `${year} year grade distribution`
                        }
                    }
                }
            });
        });

        const datasetsLine = gradeLabels.map((label, index) => ({
            label: label,
            data: gradeData[label],
            fill: false,
            borderColor: colors[index],
            tension: 0.1 // Для округлених ліній
        }));

        new Chart(document.getElementById('lineChart'), {
            type: 'line',
            data: {
                labels: years,
                datasets: datasetsLine
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of students'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Distribution grades by year'
                    }
                }
            }
        });

    })
    .catch(error => {
        console.error("Помилка завантаження XML:", error);
    });