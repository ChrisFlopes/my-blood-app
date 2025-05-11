class User < ApplicationRecord
    has_secure_password
    
    # should have named these models doctor_role, patient_role, etc.
    # but for now, let's keep them as is
    has_one :doctor
    has_one :patient
    has_one :admin
    has_one :lab_tech

    validates :email, presence: true, uniqueness: true
    validates :password_digest, presence: true
    validates :contact_number, presence: true

    def roles_list
        available_roles = ENV["ROLES"]&.split(",") || ["admin"]
        available_roles.select { |role| send(role).present? }      
    end

    def doctor_id
        doctor&.id
    end
end
