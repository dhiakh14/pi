import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CameraService } from 'src/app/services/CameraService ';

@Component({
  selector: 'app-camera-control',
  templateUrl: './camera-control.component.html',
  styleUrls: ['./camera-control.component.css']
})
export class CameraControlComponent implements OnInit, OnDestroy {
  cameraRunning = false;
  imageSrc = '';
  detections: any[] = [];
  private detectionSub!: Subscription;

  constructor(private cameraService: CameraService) {}

  ngOnInit() {
    this.checkCameraStatus();
  }

  ngOnDestroy() {
    this.stopDetection();
  }

  checkCameraStatus() {
    this.cameraService.getCameraStatus().subscribe(status => {
      this.cameraRunning = status.running;
      if (this.cameraRunning) {
        this.startDetection();
      }
    });
  }

  toggleCamera() {
    if (this.cameraRunning) {
      this.cameraService.stopCamera().subscribe(() => {
        this.cameraRunning = false;
        this.stopDetection();
      });
    } else {
      this.cameraService.startCamera().subscribe(() => {
        this.waitForCameraReady();
      });
    }
  }
  
  waitForCameraReady() {
    const interval = setInterval(() => {
      this.cameraService.getCameraStatus().subscribe(status => {
        if (status.running && status.ready) {
          clearInterval(interval);
          this.cameraRunning = true;
          this.startDetection();
        }
      });
    }, 500); 
  }
  

  startDetection() {
    this.detectionSub = this.cameraService.startDetectionPolling().subscribe({
      next: (data: any) => {
        if (data.image) {
          this.imageSrc = 'data:image/jpeg;base64,' + data.image;
        this.detections = data.detections || [];
        console.log('New detections:', this.detections);
        }
      }
    });
  }

  stopDetection() {
    if (this.detectionSub) {
      this.detectionSub.unsubscribe();
    }
    this.imageSrc = '';
    this.detections = [];
  }

  getHighestConfidence(): string {
    if (this.detections.length === 0) return '0';
    const highest = Math.max(...this.detections.map(d => d.confidence * 100));
    return highest.toFixed(1);
  }
  
  getClassColor(className: string): string {
    const hash = Array.from(className).reduce(
      (hash, char) => char.charCodeAt(0) + ((hash << 5) - hash),
      0
    );
    
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 60%)`;
  }
}