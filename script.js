Chart.register(ChartDataLabels);

fetch('z03.xml') // Замініть на фактичний шлях до вашого XML файлу
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
            'rgba(255, 0, 0, 0.6)' // Кольори для оцінок
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
                            text: 'Кількість учнів'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Рік'
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
                        text: 'Розподіл оцінок по роках'
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
                type: 'bar', // Тип діаграми
                data: {
                    labels: gradeLabels, // Оцінки для осі Y
                    datasets: [{
                        label: `Кількість учнів для ${year}`, // Назва набору даних
                        data: gradeLabels.map(label => gradeData[label][index]), // Дані для осі X
                        backgroundColor: colors,
                        hoverOffset: 4
                    }]
                },
                options: {
                    indexAxis: 'y', // Вертикальне відображення
                    responsive: false, // Вимкнути адаптивність
                    plugins: {
                        legend: {
                            display: false // Вимкнути легенду
                        },
                        title: {
                            display: true,
                            text: `Розподіл оцінок для ${year}` // Заголовок діаграми
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Оцінки' // Назва осі Y
                            },
                            beginAtZero: true,// Почати з нуля
                            ticks: {
                                autoSkip: false, // Вимкнення автоматичного пропуску
                                maxRotation: 0, // Установіть кут для кращого відображення
                                minRotation: 0 // Установіть кут для кращого відображення
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Кількість учнів' // Назва осі X
                            },
                            beginAtZero: true // Почати з нуля
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
                    responsive: false, // Змінює розміри кругової діаграми відповідно до контейнера
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: `Розподіл оцінок для ${year}`
                        }
                    }
                }
            });
        });

        const datasetsLine = gradeLabels.map((label, index) => ({
            label: label,
            data: gradeData[label], // Кількість учнів для кожної оцінки
            fill: false, // Не заповнювати область під лінією
            borderColor: colors[index], // Використання кольору з масиву
            tension: 0.1 // Для округлених ліній
        }));

// Створення лінійної діаграми
        new Chart(document.getElementById('lineChart'), {
            type: 'line',
            data: {
                labels: years, // Роки на осі X
                datasets: datasetsLine // Набори даних для оцінок
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Кількість учнів'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Рік'
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
                        text: 'Розподіл оцінок по роках'
                    }
                }
            }
        });

    })
    .catch(error => {
        console.error("Помилка завантаження XML:", error);
    });