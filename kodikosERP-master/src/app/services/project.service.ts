import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [];
  private projectsUpdated = new Subject<Project[]>();

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  // GET ALL PROJECTS
  getProjects() {
    this.http
      .get<{ message: string; projects: any }>(environment.apiUrl + '/project')
      // I am using pipe to change id na _id
      .pipe(
        map(projectsData => {
          return projectsData.projects.map(project => {
            if (typeof project.addBy === 'undefined') {
              project.addBy = {};
            }
            if (typeof project.modBy === 'undefined') {
              project.modBy = {};
            }
            return {
              id: project._id,
              data: project.data,
              comments: project.comments,
              addDate: new Date(project.addDate),
              modDate: new Date(project.modDate),
              addBy: {
                login: project.addBy.login,
                name: project.addBy.name,
                surname: project.addBy.surname,
                email: project.addBy.email
              },
              modBy: {
                login: project.modBy.login,
                name: project.modBy.name,
                surname: project.modBy.surname,
                email: project.modBy.email
              }
            };
          });
        })
      )
      .subscribe(transformedProjects => {
        // this function gets data
        // positive case
        this.projects = transformedProjects;
        this.projectsUpdated.next([...this.projects]);
      });
  }

  // I am listening to subject of projectsUpdated
  getProjectsUpdatedListener() {
    return this.projectsUpdated.asObservable();
  }

  // ADDING PROJECT
  addProject(projectData: Project) {
    const project: Project = {
      id: null,
      creator: projectData.creator,
      comments: projectData.comments,
    };

    // I'm sending data to node server
    this.http
      .post<{ message: string; projectId: string }>(
        environment.apiUrl + '/project',
        project
      )
      .subscribe(responseData => {
        const id = responseData.projectId;
        project.id = id;
        this.projects.push(project);
        // I'm emitting a new vlue to projectsUpdated
        // as a copy of contractors table
        this.projectsUpdated.next([...this.projects]);
        this.router.navigate(['/lazy/project']);
      });
  }

  // GET SINGLE PROJECT
  getProjectId(id: string) {
    return this.http.get<{ _id: string }>(environment.apiUrl + '/project/' + id);
  }

  // UPDATE PROJECT
  updateProject(id: string, projectData: Project) {
    const project: Project = projectData;
    this.http
      .put(environment.apiUrl + '/project/' + id, project)
      .subscribe(response => {
        this.router.navigate(['/lazy/project']);
      });
  }

}
