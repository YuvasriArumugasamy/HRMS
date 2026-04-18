import re

with open('src/modules/masterData/Departments.tsx', 'r') as f:
    content = f.read()

# Imports
content = content.replace("import { Card } from './ui/card';", "import Card from '@/components/ui/data-display/Card';")
content = content.replace("import { Button } from './ui/button';", "import Button from '@/components/ui/buttons/Button';")
content = content.replace("import { Input } from './ui/input';", "import TextInput from '@/components/ui/forms/TextInput';")
content = content.replace("import { Label } from './ui/label';", "")
content = content.replace("import { Badge } from './ui/badge';", "")
content = content.replace("import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';", "")
content = content.replace("import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';", "import Modal from '@/components/ui/overlays/Modal';")

# Inputs
content = content.replace("<Input", "<TextInput")

# Labels
content = content.replace("<Label", "<label")
content = content.replace("</Label>", "</label>")
content = content.replace('className="text-sm font-semibold"', 'className="block text-sm font-semibold"')

# Badges
content = content.replace('<Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm">', '<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">')
content = content.replace('<Badge className="mt-1 bg-gray-100 text-gray-600 border-gray-200 text-xs">', '<span className="inline-flex items-center px-2.5 py-0.5 rounded-full mt-1 bg-gray-100 text-gray-600 border border-gray-200 text-xs font-semibold">')
content = content.replace('<Badge className="bg-blue-100 text-blue-700 border-blue-200 font-semibold">', '<span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs">')
content = content.replace('</Badge>', '</span>')

# Buttons
content = content.replace('variant="ghost"', 'variant="none"')
content = content.replace('size="sm"\n', '')
content = content.replace('size="sm"', '')

# Search Input Layout Fix
content = content.replace('''              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <TextInput
                type="text"
                placeholder="Search departments by name, description, or manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200 bg-white text-base focus:border-[rgb(17,94,136)] focus:ring-[rgb(17,94,136)]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              )}''', '''              <TextInput
                type="text"
                placeholder="Search departments by name, description, or manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                containClassName="w-full flex-1"
                className="pl-10 pr-10 h-12 border-gray-200 bg-white text-base focus:border-[rgb(17,94,136)] focus:ring-[rgb(17,94,136)]"
                leftIcon={<Search className="w-5 h-5" />}
                rightIcon={
                  searchTerm ? (
                    <XIcon className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => setSearchTerm('')} />
                  ) : undefined
                }
              />''')

# Tables
content = content.replace('<Table>', '<table className="w-full text-sm text-left">')
content = content.replace('</Table>', '</table>')
content = content.replace('<TableHeader>', '<thead className="text-xs text-gray-700 bg-gray-50 uppercase">')
content = content.replace('</TableHeader>', '</thead>')
content = content.replace('<TableBody>', '<tbody>')
content = content.replace('</TableBody>', '</tbody>')
content = content.replace('<TableRow className="bg-gradient-to-r from-[rgb(17,94,136)] to-[rgb(17,94,136)]/80 hover:bg-gradient-to-r border-0">', '<tr className="bg-gradient-to-r from-[rgb(17,94,136)] to-[rgb(17,94,136)]/80 hover:bg-gradient-to-r border-0">')
content = content.replace('<TableRow', '<tr')
content = content.replace('</TableRow>', '</tr>')
content = content.replace('<TableHead className="text-white font-semibold">', '<th className="px-6 py-3 text-white font-semibold">')
content = content.replace('<TableHead className="text-white font-semibold text-right">', '<th className="px-6 py-3 text-white font-semibold text-right">')
content = content.replace('</TableHead>', '</th>')
content = content.replace('<TableCell>', '<td className="px-6 py-4">')
content = content.replace('<TableCell className="text-right">', '<td className="px-6 py-4 text-right">')
content = content.replace('</TableCell>', '</td>')

# Dialogs
dl1_old = '''                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={openAddDialog}
                      className="bg-gradient-to-r from-[rgb(17,94,136)] to-[rgb(17,94,136)]/90 hover:from-[rgb(17,94,136)]/90 hover:to-[rgb(17,94,136)] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl flex items-center gap-2">
                        <div className={`w-10 h-10 bg-gradient-to-br ${editingDepartment?.color || 'from-[rgb(17,94,136)] to-[rgb(17,94,136)]/70'} rounded-xl flex items-center justify-center`}>
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        {editingDepartment ? 'Edit Department' : 'Add New Department'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingDepartment ? 'Update the department information below.' : 'Enter the department details to create a new department.'}
                      </DialogDescription>
                    </DialogHeader>'''

dl1_new = '''                {/* Add Department Button */}
                <Button
                  onClick={openAddDialog}
                  className="bg-gradient-to-r from-[rgb(17,94,136)] to-[rgb(17,94,136)]/90 hover:from-[rgb(17,94,136)]/90 hover:to-[rgb(17,94,136)] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Department
                </Button>

                <Modal
                  isOpen={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                  size="md"
                  title={
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 bg-gradient-to-br ${editingDepartment?.color || 'from-[rgb(17,94,136)] to-[rgb(17,94,136)]/70'} rounded-xl flex items-center justify-center`}>
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      {editingDepartment ? 'Edit Department' : 'Add New Department'}
                    </div>
                  }
                >
                  <p className="text-gray-500 mb-4 text-sm">
                    {editingDepartment ? 'Update the department information below.' : 'Enter the department details to create a new department.'}
                  </p>'''

content = content.replace(dl1_old, dl1_new)
content = content.replace('                    </div>\n                  </DialogContent>\n                </Dialog>', '                    </div>\n                </Modal>')

dl2_old = '''      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Are you sure you want to delete this department? This action cannot be undone and will affect any associated staff records.
            </DialogDescription>
          </DialogHeader>'''

dl2_new = '''      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        size="sm"
        title={
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-red-600">Confirm Deletion</span>
          </div>
        }
      >
        <p className="text-gray-600 mb-4 text-base pt-2">
          Are you sure you want to delete this department? This action cannot be undone and will affect any associated staff records.
        </p>'''

content = content.replace(dl2_old, dl2_new)
content = content.replace('          </div>\n        </DialogContent>\n      </Dialog>', '          </div>\n      </Modal>')


with open('src/modules/masterData/Departments.tsx', 'w') as f:
    f.write(content)

print("Replacement complete.")
