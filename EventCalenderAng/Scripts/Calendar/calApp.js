var app = angular.module('calApp', ['ui.calendar', 'ngDragDrop', 'ui.bootstrap', 'angucomplete-alt']);
app.controller('calController', [
    '$scope', '$http', 'uiCalendarConfig', '$uibModal', 'deleteTaskService', function ($scope, $http, uiCalendarConfig, $uibModal, deleteTaskService) {

        $scope.employees = [];
        $scope.SelectedEmployee = null;
        $scope.numberOfPages = 1;

        //After select Employee event
        $scope.afterSelectedEmployee = function (selected) {
            if (selected) {
                $scope.SelectedEmployee = selected.originalObject;
            }
        }

        //Load Employees from server
        function populateEmployees() {
            $http.get('/home/GetEmployees', {
                method: 'GET',
                cache: true
            }).then(function (data) {
                $scope.employees = data.data;
                $scope.numberOfPages = $scope.employees.length / 5;


            });
        }

        populateEmployees();

        $scope.currentPage = 0;

        $scope.SelectedEvent = null;
        var isFirstTime = true;
        $scope.selectedFilter = '';
        $scope.employeeCalendar = {};

        $scope.setFilter = function (filter) {

            $scope.selectedFilter = filter;
            $scope.currentPage = 1;
        };

        $scope.setCalendar = function (filter) {
            populate(filter.EmployeeID);
            $scope.employeeCalendar = {
                empName: filter.Name,
                empId: filter.EmployeeID
            };
            $scope.scrollTo("cl");
        };
        $scope.scrollTo = function (selector) {
            console.log(selector);
            if (jQuery('#' + selector).length == 1) {
                console.log(jQuery('#' + selector).offset().top);
                jQuery('html, body').animate({
                    scrollTop: jQuery('#' + selector).position().top
                });
            };
        }
        $scope.assignedTasks = [];
        $scope.eventSources = [$scope.assignedTasks];
        $scope.notAssignedTasks = [];

        $scope.NewEvent = {};

        //this function for get datetime from json date
        function getDate(datetime) {
            if (datetime != null) {
                var mili = datetime.replace(/\/Date\((-?\d+)\)\//, '$1');
                return new Date(parseInt(mili));
            } else {
                return "";
            }
        }

        // this function for clear calendar Tasks
        function clearCalendar() {
            if (uiCalendarConfig.calendars.myCalendar != null) {
                uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
                uiCalendarConfig.calendars.myCalendar.fullCalendar('unselect');
            }
        }


        //Load events from server
        function populate(empId) {
            clearCalendar();
            //$http.get('/home/GetAssignedTasks', {
            //    cache: false,
            //    data: { 'empId': empId },
            //    //params: { }
            //})
            $http({
                method: 'POST',
                url: '/home/GetAssignedTasks',
                data: { 'empId': empId }
            }).then(function (data) {

                $scope.assignedTasks.slice(0, $scope.assignedTasks.length);

                angular.forEach(data.data, function (value) {
                    $scope.assignedTasks.push({
                        id: value.TaskID,
                        title: value.Title,
                        description: value.Description,
                        start: (angular.isUndefined(value.StartAt) || value.StartAt === null) ? moment().format() : moment(value.StartAt).toDate(),
                        end: (angular.isUndefined(value.EndAt) || value.EndAt === null) ? moment().format() : moment(value.EndAt).toDate(),
                        allDay: value.IsFullDay,
                        stick: true,
                        EmployeeName:value.EmployeeName,
                        LocationName: value.LocationName,
                        EmployeeID: value.EmployeeID,
                        LocationID: value.LocationID
                    });
                });


            });
        }

        populate();
        function populateNotAssigned() {
            $http.get('/home/GetNotAssignedTasks', {
                cache: false,
                params: {}
            }).then(function (data) {
                $scope.notAssignedTasks.slice(0, $scope.notAssignedTasks.length);
                $scope.notAssignedTasks = [];
                angular.forEach(data.data, function (value) {
                    $scope.notAssignedTasks.push({
                        id: value.TaskID,
                        title: value.Title,
                        description: value.Description,
                        start: (angular.isUndefined(value.StartAt) || value.StartAt === null) ? moment().format() : moment(value.StartAt).toDate(),
                        end: (angular.isUndefined(value.EndAt) || value.EndAt === null) ? moment().format() : moment(value.EndAt).toDate(),
                        allDay: value.IsFullDay,
                        stick: true,
                        LocationName: value.LocationName,
                        EmployeeName: value.EmployeeName,
                        LocationID:value.LocationID
                      
                    });
                });


            });
        }

        populateNotAssigned();

        $scope.locations = [];
        $scope.SelectedLocation = null;

        $scope.afterSelectedLocation = function (selected) {
            if (selected) {
                $scope.SelectedLocation = selected.originalObject;
            }
        }
        //Load locations from server
        function populateLocations() {
            $http.get('/home/GetLocations', {
                method: 'GET',
                cache: true
            }).then(function (data) {
                $scope.locations = data.data;
            });
        }
        populateLocations();


       

        $scope.range = function (start, end) {
            var ret = [];
            if (!end) {
                end = start;
                start = 0;
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.getNumber.length) {
                $scope.currentPage++;
            }
        };

        $scope.setPage = function (n) {
            $scope.currentPage = n;
        };

        //$scope.getNumber = function (num) {
        //    return new Array(num);
        //}
        $scope.getNumber = new Array(0);
        $scope.$watch('numberOfPages', function () {
            $scope.getNumber = new Array($scope.numberOfPages);
            $scope.currentPage = 1;
        });

       
        //configure calendar
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                displayEventTime: true,
                header: {
                    left: 'month agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                timeFormat: {
                    month: ' ', // for hide on month view
                    agenda: 'h:mm t'
                },

                selectable: true,
                selectHelper: true,
                forceEventDuration: true,
                select: function (start, end) {
                    var fromDate = moment(start).format('YYYY/MM/DD LT');
                    var endDate = moment(end).format('YYYY/MM/DD LT');
                    $scope.NewEvent = {
                        StartAt: fromDate,
                        EndAt: endDate,
                        IsFullDay: false,
                        Title: '',
                        Description: ''
                    }
                    $scope.isNewTask = false;

                    $scope.ShowModal();
                },
                eventClick: function (event) {
                    $scope.SelectedEvent = event;
                    var fromDate = moment(event.start).format('YYYY/MM/DD LT');
                    var endDate = moment(event.end).format('YYYY/MM/DD LT');
                    $scope.NewEvent = {
                        TaskID: event.id,
                        StartAt: fromDate,
                        EndAt: endDate,
                        IsFullDay: false,
                        Title: event.title,
                        Description: event.description,
                        EmployeeID: event.EmployeeID,
                        EmployeeName: event.EmployeeName,
                        LocationName: event.LocationName,
                        LocationID: event.LocationID
                    }
                   
                    $scope.isNewTask = false;
                    $scope.ShowModal();
                },
                eventAfterAllRender: function () {
                    if ($scope.assignedTasks.length > 0 && isFirstTime) {
                        //Focus first event
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.assignedTasks[0].start);
                        isFirstTime = false;
                    }
                },

                droppable: true,
                drop: function (date, event) {
                    $scope.SelectedEvent = event;
                    var title = $(this).attr('data-title');
                    var description = $(this).attr('data-detail');
                    var id = $(this).attr('data-id');
                    var locationId = $(this).attr('data-locationId');

                    var d = new Date(date);
                    var stDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 00, 00, 00, 00);
                    var ndDate = new Date(d.getFullYear(), d.getMonth(), stDate.getDate() + 1, 00, 00, 00, 00);
                   
                    $scope.NewEvent = {
                        TaskID: id,
                        StartAt: stDate,
                        EndAt: ndDate,
                        IsFullDay: false,
                        Title: title,
                        Description: description,
                        EmployeeID: $scope.employeeCalendar.empId,
                        LocationID:locationId
                        //EmployeeName: event.EmployeeName
                    }
                    if (angular.isUndefined($scope.employeeCalendar.empId) || $scope.employeeCalendar.empId === null) {
                        $scope.ShowModal();
                    } else {
                        $http({
                            method: 'POST',
                            url: '/home/SaveTask',
                            data: $scope.NewEvent
                        }).then(function (response) {
                            if (response.data.status) {
                                populate($scope.employeeCalendar.empId);
                                populateNotAssigned();
                            }
                        });

                    }
                   
                    $(this).remove();

                },
                eventResize: function (event, delta, revertFunc) {

                    $scope.NewEvent = {
                        TaskID: event.id,
                        StartAt: event.start.format(),
                        EndAt: event.end.format(),
                        IsFullDay: false,
                        Title: event.title,
                        Description: "sm",
                        EmployeeID: $scope.employeeCalendar.empId,
                        LocationID: event.LocationID
                        //EmployeeName: event.EmployeeName
                    }
                    if (!confirm("Are you sure about this change?")) {
                        revertFunc();
                    } else {
                        $http({
                            method: 'POST',
                            url: '/home/SaveTask',
                            data: $scope.NewEvent
                        }).then(function (response) {
                            if (response.data.status) {
                                populate($scope.employeeCalendar.empId);
                            }
                        });
                    }

                },
                eventDrop: function (event, delta, revertFunc) {
                    //alert(event.start);
                    //alert(event.end);

                    $scope.NewEvent = {
                        TaskID: event.id,
                        StartAt: event.start.format(),
                        EndAt: event.end.format(),
                        IsFullDay: false,
                        Title: event.title,
                        Description: "sm",
                        EmployeeID: $scope.employeeCalendar.empId,
                        LocationID: event.LocationID
                    }
                    if (!confirm("Are you sure about this change?")) {
                        revertFunc();
                    } else {
                        $http({
                            method: 'POST',
                            url: '/home/SaveTask',
                            data: $scope.NewEvent
                        }).then(function (response) {
                            if (response.data.status) {
                                populate($scope.employeeCalendar.empId);
                            }
                        });
                    }


                }
            }
        };
        // delete task button in tasks list
        $scope.DeleteTask = function (id) {
            alertify.confirm('Delete task', "Are you sure you want to delete this Task?",
           function () {
               deleteTaskService.DeleteTask(id).then(function (d) {

                   if (d.data.status === true) {
                       alertify.success('the Task is successfully deleted');
                       populateNotAssigned();
                   } else {
                       alert('Error: Failed to delete');
                   }
               }, function () {
                   alert('Error: Failed to delete');

               });
            },
           function () {
               alertify.error('the Task is not deleted');
           }).set({ transition: 'zoom' });
           
        }
        $scope.isNewTask = false;
        $scope.AddTask = function () {
            $scope.NewEvent = {
                TaskID: null,
                StartAt: null,
                EndAt: null,
                IsFullDay: false,
                Title: null,
                Description: null,
                EmployeeID: null,
                EmployeeName: null,
                LocationName: null,
                LocationID: null
            }
            $scope.isNewTask = true;
            $scope.ShowModal();
        }

        //This function for show modal dialog
        $scope.ShowModal = function () {
            $scope.option = {
                templateUrl: 'modalContent.html',
                controller: 'modalController',
                backdrop: 'static',
                resolve: {
                    NewEvent: function () {
                        return $scope.NewEvent;
                    },
                    Employees: function () {
                        return $scope.employees;
                    },
                    SelectedEmployee: function () {
                        return $scope.employeeCalendar;
                    },
                    Locations: function () {
                        return $scope.locations;
                    },
                    IsNewTask: function () {
                        return $scope.isNewTask;
                    }
                }
            };
            var modal = $uibModal.open($scope.option);
            modal.result.then(function (data) {
                $scope.NewEvent = data.event;
                switch (data.operation) {
                    case 'Save':
                        //Save here
                        $http({
                            method: 'POST',
                            url: '/home/SaveTask',
                            data: $scope.NewEvent
                        }).then(function (response) {
                            if (response.data.status) {
                                populate($scope.employeeCalendar.empId);
                                populateNotAssigned();
                            }
                        });
                        break;
                    case 'Delete':
                        //Delete here $http({
                        $http({
                            method: 'POST',
                            url: '/home/DeleteTask',
                            data: { 'taskId': $scope.NewEvent.TaskID }
                        }).then(function (response) {
                            if (response.data.status) {
                                populate($scope.employeeCalendar.empId);
                            }
                        });
                        break;
                    case 'cancel':
                        populateNotAssigned();
                        //populate();
                        break;
                    default:
                       
                        break;
                }
            }, function () {
                console.log('Modal dialog closed');
               
            });
        }

        
    }
]);


// create a new controller for modal 
app.controller('modalController', [
        '$scope', '$uibModalInstance', 'NewEvent', 'Employees', 'Locations', 'IsNewTask', 'SelectedEmployee', function($scope, $uibModalInstance, NewEvent, Employees, Locations, IsNewTask, SelectedEmployee) {
            $scope.NewEvent = NewEvent;
            $scope.employees = Employees;
            $scope.locations = Locations;
            $scope.SelectedEmployee = null;

            if (!IsNewTask) {
                if (SelectedEmployee.empId != null) {
                    $scope.EmployeeName = SelectedEmployee.empName;
                    $scope.NewEvent.EmployeeID = SelectedEmployee.empId;
                } else {
                    $scope.EmployeeName = NewEvent.EmployeeName;

                }
            }
            $scope.locationName = NewEvent.LocationName;
            $scope.NewEvent.LocationID = NewEvent.LocationID;
            $scope.isNewTask = IsNewTask;

            //After select Employee event
            $scope.afterSelectedEmployee = function(selected) {
                if (selected) {
                    $scope.SelectedEmployee = selected.originalObject;
                    $scope.NewEvent.EmployeeID = $scope.SelectedEmployee.EmployeeID;
                }
            }
            $scope.afterSelectedLocation = function(selected) {
                if (selected) {
                    $scope.SelectedLocation = selected.originalObject;
                    $scope.NewEvent.LocationID = $scope.SelectedLocation.LocationID;
                }
            }
            $scope.Message = "";
            $scope.ok = function() {
                if ($scope.NewEvent.Title.trim() != "" && angular.isDefined($scope.NewEvent.EmployeeID)) {
                    $uibModalInstance.close({ event: $scope.NewEvent, operation: 'Save' });
                } else {
                    $scope.Message = "Task Title and Task Employee required!";
                }
            }
            $scope.delete = function() {
                $uibModalInstance.close({ event: $scope.NewEvent, operation: 'Delete' });
            }
            $scope.cancel = function() {
                $uibModalInstance.close({ event: $scope.NewEvent, operation: 'cancel' });

                //$uibModalInstance.dismiss('cancel');
            }
        }
    ])
    .filter('startFrom', function() {
        return function(data, start) {
            start = 0 + start;
            return data.slice(start);
        }
    }).factory('deleteTaskService', function($http) {
        var fac = {};
        fac.DeleteTask = function(id) {
            return $http({
                method: 'POST',
                url: '/home/DeleteTask',
                data: { 'taskId': id }
            });
        }
        return fac;
    });

// By Ali Sallam