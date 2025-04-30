    package com.example.sprinproject.Entity;

    import com.fasterxml.jackson.annotation.JsonBackReference;
    import com.fasterxml.jackson.annotation.JsonIgnore;
    import com.fasterxml.jackson.annotation.JsonProperty;
    import jakarta.persistence.*;
    import lombok.*;

    import java.time.LocalDate;
    import java.time.ZoneId;
    import java.time.temporal.ChronoUnit;
    import java.util.Date;
    import java.util.concurrent.TimeUnit;

    @Entity
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor

    public class Task {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long idTask;
        private String name;
        private String description ;
        private Date startDate ;
        private Date planned_end_date;
        private Date actual_end_date;
        @Enumerated(EnumType.STRING)
        private Status Status;

        @JsonProperty("projectId")

        private Long projectId;



        public long getDurationInDays() {
            if (startDate == null || planned_end_date == null) {
                return 0;
            }

            LocalDate startLocalDate = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            LocalDate plannedEndLocalDate = planned_end_date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

            return ChronoUnit.DAYS.between(startLocalDate, plannedEndLocalDate);
        }



        @ManyToOne
        @JsonBackReference

        private GanttChart ganttChart;

        public Long getProjectId() {
            return projectId;
        }

        public void setProjectId(Long projectId) {
            this.projectId = projectId;
        }

        @Override
        public String toString() {
            return "Task{" +
                    "idTask=" + idTask +
                    ", name='" + name + '\'' +
                    ", description='" + description + '\'' +
                    ", startDate=" + startDate +
                    ", planned_end_date=" + planned_end_date +
                    ", actual_end_date=" + actual_end_date +
                    ", Status=" + Status +
                    ", projectId=" + projectId +
                    '}';
        }
    }
