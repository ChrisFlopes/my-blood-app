Rails.application.routes.draw do
  root "users#index"

  namespace :api, defaults: { format: :json } do
    post 'auth/login', to: 'auth#login'
    post 'auth/refresh', to: 'auth#refresh'
    post 'auth/register', to: 'auth#register'

    namespace :users do
      get 'me', to: 'profiles#show'
      put 'me', to: 'profiles#update'
    end

    resources :users, only: [:index, :create, :show, :update] do
      post "roles", to: "users#update_roles"
      delete "roles", to: "users#remove_role"
    end

    resources :blood_work_types, only: [:index, :create, :update] do
      patch "toggle_activation", to: "blood_work_types#toggle_activation"
    end

    resources :scheduled_blood_works, only: [:index, :create] do
      collection do
        get "doctor_requests", to: "scheduled_blood_works#doctor_requests"
        get "doctor_approved", to: "scheduled_blood_works#doctor_approved"
        get "doctor_open_requests", to: "scheduled_blood_works#doctor_open_requests"
        patch "patients/:patient_id/scheduledbloodworks/:id/approve", to: "scheduled_blood_works#approve"
        patch "patients/:patient_id/scheduledbloodworks/:id/reject", to: "scheduled_blood_works#reject"
      end
    end

    resources :patients, only: [:index]

    patch "scheduled_blood_works/:id/approve", to: "scheduled_blood_works#approve"
    patch "scheduled_blood_works/:id/reject", to: "scheduled_blood_works#reject"

    get "doctors/:doctor_id/patients", to: "doctors#patients"
    post "doctors/:doctor_id/assign_patients", to: "doctors#assign_patient"
    post "doctors/:doctor_id/unassign_patients", to: "doctors#unassign_patients"

    get "patients/:id", to: "patients#show"
    get "patients/:id/blood_test_results", to: "patients#blood_test_results"

    get "patients/:patient_id/scheduledbloodworks", to: "scheduled_blood_works#index"
    post "patients/:patient_id/scheduledbloodworks", to: "scheduled_blood_works#create"
    patch "patients/:patient_id/scheduledbloodworks/:id/cancel", to: "scheduled_blood_works#cancel"
    patch "patients/:patient_id/scheduledbloodworks/:id/approve", to: "scheduled_blood_works#approve"
    patch "patients/:patient_id/scheduledbloodworks/:id/reject", to: "scheduled_blood_works#reject"

    get "patients/:patient_id/scheduledbloodworks/requests", to: "scheduled_blood_works#requests"
    get "patients/:patient_id/scheduledbloodworks/approved", to: "scheduled_blood_works#approved"
    get "patients/:patient_id/scheduledbloodworks/cancelled", to: "scheduled_blood_works#cancelled"
    get "patients/:patient_id/scheduledbloodworks/open_requests", to: "scheduled_blood_works#open_requests"

    post "blood_test_results/import_csv", to: "blood_test_results#import_csv"
    get "patients/:patient_id/export_csv", to: "patients#export_csv"
  end
end
